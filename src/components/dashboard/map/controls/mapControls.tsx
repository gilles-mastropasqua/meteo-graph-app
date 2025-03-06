// Importing custom Mapbox controls and styles
import CompassControl from '@mapbox-controls/compass';
import ZoomControl from '@mapbox-controls/zoom';
import RulerControl from '@mapbox-controls/ruler';
import { ElevationControl } from 'react-mapbox-elevation-control';
import InspectControl from '@mapbox-controls/inspect';
import mapboxgl from 'mapbox-gl';

// Importing styles for custom controls
import '@mapbox-controls/compass/src/index.css';
import '@mapbox-controls/zoom/src/index.css';
import '@mapbox-controls/ruler/src/index.css';
import '@mapbox-controls/inspect/src/index.css';
import 'react-mapbox-elevation-control/dist/styles.css';
import '@mapbox-controls/styles/src/index.css';


/**
 * Adds primary controls to the Mapbox map instance.
 *
 * @param {mapboxgl.Map} map - The Mapbox map instance to which controls are added.
 */
export const initializeMapControls = (map: mapboxgl.Map): void => {
    // Add fullscreen control for toggling fullscreen mode
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Add compass control with instant rotation
    map.addControl(new CompassControl({ instant: true }), 'top-right');

    // Add zoom control to adjust map zoom level
    map.addControl(new ZoomControl(), 'top-right');

    // Add ruler control for measuring distances
    map.addControl(new RulerControl(), 'top-right');

    // Add elevation control to view elevation profiles
    map.addControl(new ElevationControl(), 'top-right');

    // Add inspect control for inspecting map features
    map.addControl(new InspectControl(), 'top-right');

    // const styles = [{
    //     label: 'Outdoors',
    //     styleName: 'Mapbox Outdoors',
    //     styleUrl: 'mapbox://styles/mapbox/outdoors-v12',
    // }, {
    //     label: 'Satellite Street',
    //     styleName: 'Mapbox Satellite Street',
    //     styleUrl: 'mapbox://styles/mapbox/satellite-streets-v12',
    // }];
    //
    // map.addControl(new StylesControl({ styles: styles, compact: true }), 'top-right');

};
