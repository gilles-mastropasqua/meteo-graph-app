import { create } from 'zustand';
import { zoomAdjust } from '@/lib/map';

interface MapState {
    mapRef: mapboxgl.Map | null;
    lastPosition: { center: [number, number]; zoom: number } | null;
    setMapRef: (map: mapboxgl.Map) => void;
    flyToLocation: (longitude: number, latitude: number, zoom: number) => void;
    savePosition: (center: [number, number], zoom: number) => void;
    loadSavedPosition: () => { center: [number, number]; zoom: number } | null;
}

export const useMapStore = create<MapState>((set, get) => ({
    mapRef: null,
    lastPosition: null,

    /**
     * Stores the Mapbox map instance.
     */
    setMapRef: (map) => set({ mapRef: map }),

    /**
     * Moves the map view smoothly to the specified coordinates and zoom level.
     */
    flyToLocation: (longitude, latitude, zoom) => {
        const map = get().mapRef;
        if (map) {
            map.flyTo({ center: [longitude, latitude], zoom: zoomAdjust(zoom), duration: 2000 });
        }
    },

    /**
     * Saves the current map position (center and zoom) in the store and localStorage.
     */
    savePosition: (center, zoom) => {
        set({ lastPosition: { center, zoom } });
        localStorage.setItem('mapPosition', JSON.stringify({ center, zoom }));
    },

    /**
     * Loads the last saved map position from localStorage.
     */
    loadSavedPosition: () => {
        const saved = localStorage.getItem('mapPosition');
        return saved ? JSON.parse(saved) : null;
    },
}));
