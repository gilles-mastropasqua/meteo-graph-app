'use client';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import { initializeMapControls } from '@/components/dashboard/map/controls/mapControls';
import { usePostesStore } from '@/stores/usePostesStore';
import { usePopupStore } from '@/stores/usePopupStore';
import { useMapStore } from '@/stores/useMapStore';
import Loading from '@/app/dashboard/loading';
import { Feature, Point } from 'geojson';
import { GetPostesQuery } from '@/graphql/generated';

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
    const { openPopup } = usePopupStore();

    useEffect(() => {
        if (!mapContainer.current || mapInstance.current) return;

        // Load the last saved map position
        const lastPosition = loadSavedPosition();

        // Initialize Mapbox instance
        mapInstance.current = new mapboxgl.Map({
            container: mapContainer.current as HTMLDivElement,
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: lastPosition ? lastPosition.center : [2.2137, 46.6034], // Default to France
            zoom: lastPosition ? lastPosition.zoom : 5.5,
        });

        mapInstance.current.on('load', () => {
            if (!mapInstance.current) return;

            setMapRef(mapInstance.current);
            initializeMapControls(mapInstance.current);

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
                            typePoste: poste.typePosteActuel,
                            commune: poste.commune,
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

            // Add Mapbox layer for stations
            mapInstance.current.addLayer({
                id: 'postes-layer',
                type: 'circle',
                source: 'postes',
                paint: {
                    'circle-radius': 6,
                    'circle-color': [
                        'match',
                        ['get', 'typePoste'],
                        1, '#3498db', // Blue
                        2, '#2ecc71', // Green
                        3, '#f1c40f', // Yellow
                        4, '#e74c3c', // Red
                        0, '#aa00ff', // Purple
                        '#7f8c8d', // Default Gray
                    ],
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#fff',
                },
            });

            // Show tooltip on hover
            mapInstance.current.on('mouseenter', 'postes-layer', (e) => {
                if (!mapInstance.current || !e.features || e.features.length === 0) return;

                const feature = e.features[0] as Feature<Point>;
                const { properties, geometry } = feature;

                if (!properties || geometry.type !== 'Point' || !Array.isArray(geometry.coordinates)) return;

                const poste = properties as unknown as PosteType; // ✅ Explicitly cast properties to expected type

                new mapboxgl.Popup({ closeButton: false, closeOnClick: false })
                    .setLngLat(geometry.coordinates as [number, number])
                    .setHTML(`<strong class="text-black">${poste.nomUsuel || 'Unknown'}</strong>`)
                    .addTo(mapInstance.current);
            });

            // Remove tooltip on mouse leave
            mapInstance.current.on('mouseleave', 'postes-layer', () => {
                if (!mapInstance.current) return;
                mapInstance.current.getCanvas().style.cursor = '';
                document.querySelectorAll('.mapboxgl-popup').forEach((popup) => popup.remove());
            });

            // Open a custom popup on click
            mapInstance.current.on('click', 'postes-layer', (e) => {
                if (!mapInstance.current || !e.features || e.features.length === 0) return;

                const feature = e.features[0] as Feature<Point>;
                const poste = feature.properties as unknown as PosteType; // ✅ Correctly cast properties

                openPopup(poste);
            });

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
    }, [setMapRef, savePosition, loadSavedPosition, postes, openPopup]);

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
