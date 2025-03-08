'use client';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import { initializeMapControls } from '@/components/dashboard/map/controls/mapControls';
import { usePostesStore } from '@/stores/usePostesStore';
import { usePopupStore } from '@/stores/usePopupStore';
import { useMapStore } from '@/stores/useMapStore';
import Loading from '@/app/(dashboard)/dashboard/loading';
import { Feature, Point } from 'geojson';
import { GetPostesQuery } from '@/graphql/generated';
import StylesControl from '@mapbox-controls/styles';
import { getStationType, zoomAdjust } from '@/lib/map';


if (!process.env.NEXT_PUBLIC_MAPBOX_API_KEY) {
    throw new Error('Mapbox API key is not defined in the environment variables.');
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

/**
 * Type definition for a single weather station (Poste).
 */
type PosteType = GetPostesQuery['findManyPoste'][0];

/**
 * MeteoGraphMap component: Displays a Mapbox map with weather station markers.
 */
const MeteoGraphMap = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<mapboxgl.Map | null>(null);
    const [isMapReady, setMapReady] = useState(false);

    const { setMapRef, savePosition, loadSavedPosition } = useMapStore();
    const { postes } = usePostesStore();
    const { openDrawer } = usePopupStore();


    // References to save sources and layers for restoration
    const savedSources = useRef<Record<string, mapboxgl.SourceSpecification>>({});
    const savedLayers = useRef<mapboxgl.Layer[]>([]);

    /**
     * Saves all current sources and layers from the map for later restoration.
     * @param map - The Mapbox map instance.
     */
    const saveSourcesAndLayers = (map: mapboxgl.Map) => {
        const sources: Record<string, mapboxgl.SourceSpecification> = {};
        const layers: mapboxgl.Layer[] = [];

        // Save all sources from the map's current style
        Object.entries(map.getStyle()!.sources).forEach(([id, source]) => {
            sources[id] = source;
        });

        // Save only layers added by the application
        map.getStyle()!.layers?.forEach((layer) => {
            if (layer.id.endsWith('layer')) {
                layers.push(layer);
            }
        });

        savedSources.current = sources;
        savedLayers.current = layers;

        console.log('Saved sources:', savedSources.current);
        console.log('Saved layers:', savedLayers.current);
    };

    /**
     * Restores all previously saved sources and layers back onto the map.
     * @param map - The Mapbox map instance.
     */
    const restoreSourcesAndLayers = (map: mapboxgl.Map) => {
        // Restore all sources
        Object.entries(savedSources.current).forEach(([id, source]) => {
            if (!map.getSource(id)) {
                console.log(`Restoring source: ${id}`);
                map.addSource(id, source);
            }
        });

        // Restore all layers
        savedLayers.current.forEach((layer) => {
            if (!map.getLayer(layer.id)) {
                console.log(`Restoring layer: ${layer.id}`);
                try {
                    map.addLayer(layer);
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Unknown error';
                    console.warn(`Failed to add layer ${layer.id}: ${message}`);
                    console.error(error);
                }
            }
        });
    };


    useEffect(() => {
        if (!mapContainer.current || mapInstance.current) return;

        // Load the last saved map position
        const lastPosition = loadSavedPosition();

        // Initialize Mapbox instance
        mapInstance.current = new mapboxgl.Map({
            container: mapContainer.current as HTMLDivElement,
            style: localStorage.getItem('selectedMapStyle') || 'mapbox://styles/mapbox/outdoors-v12',
            center: lastPosition ? lastPosition.center : [2.2137, 46.6034], // Default to France
            zoom: lastPosition ? lastPosition.zoom : zoomAdjust(5.5),
            preserveDrawingBuffer: true,
        });

        mapInstance.current.on('load', () => {
            if (!mapInstance.current) return;

            // Add StylesControl for switching map styles
            const styles = [
                {
                    label: 'Outdoors',
                    styleName: 'Mapbox Outdoors',
                    styleUrl: 'mapbox://styles/mapbox/outdoors-v12',
                },
                {
                    label: 'Satellite',
                    styleName: 'Mapbox Satellite Street',
                    styleUrl: 'mapbox://styles/mapbox/satellite-streets-v12',
                },
            ];

            mapInstance.current.addControl(
                new StylesControl({
                    styles: styles,
                    compact: false, // Display expanded style menu
                    onChange: (style) => {

                        // Save selected style in localStorage
                        localStorage.setItem('selectedMapStyle', style.styleUrl);

                        // Save current sources and layers
                        saveSourcesAndLayers(mapInstance.current!);

                        // Change the map's style
                        mapInstance.current?.setStyle(style.styleUrl);

                        // Restore sources and layers after the new style loads
                        mapInstance.current?.once('style.load', () => {
                            restoreSourcesAndLayers(mapInstance.current!);
                        });
                    },
                }),
                'top-right',
            );


            setMapRef(mapInstance.current);

            initializeMapControls(mapInstance.current);

            // Save initial sources and layers
            saveSourcesAndLayers(mapInstance.current);

            // Add GeoJSON source for stations
            mapInstance.current.addSource('postes', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: postes.map((poste) => ({
                        type: 'Feature',
                        geometry: { type: 'Point', coordinates: [poste.lon, poste.lat] },
                        properties: {
                            numPoste: poste.numPoste,
                            nomUsuel: poste.nomUsuel,
                            typePosteActuel: poste.typePosteActuel,
                            commune: poste.commune,
                            lieuDit: poste.lieuDit,
                            alti: poste.alti,
                            datouvr: poste.datouvr,
                            datferm: poste.datferm,
                            lambx: poste.lambx,
                            lamby: poste.lamby,
                            lat: poste.lat,
                            lon: poste.lon,
                            posteOuvert: poste.posteOuvert,
                        } as PosteType, // ✅ Ensure properties match the expected type
                    })),
                },
            });

            mapInstance.current.addLayer({
                id: 'postes-layer',
                type: 'circle',
                source: 'postes',
                paint: {
                    'circle-radius': [
                        'interpolate', ['linear'], ['zoom'],
                        0, 1,   // Zoom 0 => 1px radius
                        22, 23,  // Zoom 22 => 22px radius
                    ],
                    'circle-color': [
                        'match',
                        ['get', 'typePosteActuel'],
                        0, '#007208',
                        1, '#006c80',
                        2, '#0027a9',
                        3, '#efc300',
                        4, '#ff8f00',
                        5, '#ff1900',
                        '#7f8c8d', // Default
                    ],
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff',
                },
            });

            // mapInstance.current.on('zoom', () => {
            //     if (!mapInstance.current) return;
            //     mapInstance.current.setPaintProperty('postes-layer', 'circle-radius', [
            //         'interpolate', ['linear'], ['zoom'],
            //         5, 4,
            //         10, 8,
            //         15, 12,
            //         18, 18,
            //     ]);
            // });
            //

            // Show tooltip on hover
            mapInstance.current.on('click', 'postes-layer', (e) => {
                if (!mapInstance.current || !e.features || e.features.length === 0) return;

                mapInstance.current.getCanvas().style.cursor = 'pointer';

                const feature = e.features[0] as Feature<Point>;
                const { properties, geometry } = feature;

                if (!properties || geometry.type !== 'Point' || !Array.isArray(geometry.coordinates)) return;

                const poste = properties as unknown as PosteType; // ✅ Explicitly cast properties to expected type

                const formatDate = (dateStr: string | null | undefined): string => {
                    if (!dateStr) return 'N/A';
                    const date = new Date(dateStr);
                    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                    });
                };

                // new mapboxgl.Popup({ closeButton: true, closeOnClick: true, className: 'poste_popup_container' })
                //     .setLngLat(geometry.coordinates as [number, number])
                //     .setHTML(`
                //         <div class="">
                //             <h5 class="text-center">#${poste.numPoste}</h5>
                //             <h4 class="text-center">${poste.nomUsuel || 'Unknown Name'}</h4>
                //             <hr class="mt-3 mb-4"/>
                //             <table class="w-full text-sm">
                //                 <tbody>
                //                     <tr><td >City:</td><td>${poste.commune || 'N/A'}</td></tr>
                //                     <tr><td >Altitude:</td><td>${poste.alti || 'N/A'} m</td></tr>
                //                     <tr><td >Opening Date:</td><td>${formatDate(poste.datouvr)}</td></tr>
                //                     <tr><td >Closing Date:</td><td>${formatDate(poste.datferm)}</td></tr>
                //                     <tr><td >Location:</td><td>${poste.lieuDit || 'N/A'}</td></tr>
                //                     <tr><td >Latitude:</td><td>${poste.lat}</td></tr>
                //                     <tr><td >Longitude:</td><td>${poste.lon}</td></tr>
                //                     <tr><td >LambX:</td><td>${poste.lambx}</td></tr>
                //                     <tr><td >LambY:</td><td>${poste.lamby}</td></tr>
                //                     <tr><td >Station Type:</td><td>${poste.typePosteActuel} </td></tr>
                //                 </tbody>
                //             </table>
                //             <p>${getStationType(poste.typePosteActuel)}</p>
                //             <button class="w-full mt-2 bg-primary text-white rounded-md py-1" onclick="openDrawer(poste);">View Details</button>
                //         </div>
                //     `)
                //     .addTo(mapInstance.current);

                new mapboxgl.Popup({ closeButton: true, closeOnClick: true, className: 'poste_popup_container' })
                    .setLngLat(geometry.coordinates as [number, number])
                    .setHTML(`
                        <div class="popup-content">
                            <h5 class="text-center">#${poste.numPoste}</h5>
                            <h4 class="text-center">${poste.nomUsuel || 'Unknown Name'}</h4>
                            <hr class="mt-3 mb-4"/>
                            <table class="w-full text-sm">
                                <tbody>
                                    <tr><td>City:</td><td>${poste.commune || 'N/A'}</td></tr>
                                    <tr><td>Altitude:</td><td>${poste.alti || 'N/A'} m</td></tr>
                                    <tr><td>Opening Date:</td><td>${formatDate(poste.datouvr)}</td></tr>
                                    <tr><td>Closing Date:</td><td>${formatDate(poste.datferm)}</td></tr>
                                    <tr><td>Location:</td><td>${poste.lieuDit || 'N/A'}</td></tr>
                                    <tr><td>Latitude:</td><td>${poste.lat}</td></tr>
                                    <tr><td>Longitude:</td><td>${poste.lon}</td></tr>
                                    <tr><td>LambX:</td><td>${poste.lambx}</td></tr>
                                    <tr><td>LambY:</td><td>${poste.lamby}</td></tr>
                                    <tr><td>Station Type:</td><td>${poste.typePosteActuel}</td></tr>
                                </tbody>
                            </table>
                            <p>${getStationType(poste.typePosteActuel)}</p>
                            <button class="open-drawer-btn w-full mt-2 bg-primary text-primary-foreground rounded-xs py-1 hover:cursor-pointer hover:bg-primary-foreground hover:text-primary" data-id="${poste.numPoste}">
                                View Details
                            </button>
                        </div>
                    `).addTo(mapInstance.current);

                document.addEventListener('click', (event) => {
                    const target = event.target as HTMLElement;

                    if (target.classList.contains('open-drawer-btn')) {
                        const posteId = target.getAttribute('data-id');
                        const selectedPoste = postes.find((p) => p.numPoste.toString() === posteId);
                        if (selectedPoste) openDrawer(selectedPoste);
                    }
                });


            });

            // Remove tooltip on mouse leave
            // mapInstance.current.on('mouseleave', 'postes-layer', () => {
            //     if (!mapInstance.current) return;
            //     mapInstance.current.getCanvas().style.cursor = '';
            //     document.querySelectorAll('.mapboxgl-popup').forEach((popup) => popup.remove());
            // });


            // mapInstance.current.on('click', 'postes-layer', (e) => {
            //     if (!mapInstance.current || !e.features || e.features.length === 0) return;
            //
            //     const feature = e.features[0] as Feature<Point>;
            //     const poste = feature.properties as unknown as PosteType;
            //
            //     openDrawer(poste);
            // });

            setMapReady(true);
        });

        // Save map position when moved
        mapInstance.current.on('moveend', () => {
            if (!mapInstance.current) return;
            const center = mapInstance.current.getCenter().toArray() as [number, number];
            const zoom = mapInstance.current.getZoom();
            savePosition(center, zoom);
        });

        // Cleanup function when component unmounts
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [setMapRef, savePosition, loadSavedPosition, postes, openDrawer]);

    // Ensure the map resizes properly when it's ready
    useEffect(() => {
        if (mapInstance.current) {
            mapInstance.current.resize();
        }
    }, [isMapReady]);
    

    return (
        <>
            <div
                className={`min-h-[100vh] flex-1 bg-muted/50 md:min-h-min overflow-hidden transition-opacity duration-500 ${isMapReady ? 'opacity-100' : 'opacity-0'}`}
                ref={mapContainer}
            />
            {!isMapReady && <Loading text="Loading map..." />}
        </>
    );
};

export default MeteoGraphMap;
