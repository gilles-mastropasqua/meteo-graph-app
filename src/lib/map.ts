export function zoomAdjust(zoom: number): number {
    const scaleFactor = window.innerWidth < 768 ? 0.8 : 1;
    return parseFloat((zoom * scaleFactor).toFixed(1));
}

// Function to get the station type description
export const getStationType = (type: number | null | undefined): string => {

    const stationTypes: Record<number, string> = {
        0: 'Synoptic station, real-time acquisition, expertise at D+1',
        1: 'Automatic Radome-Resome station, real-time acquisition, expertise at D+1',
        2: 'Non-Radome-Resome automatic station, real-time acquisition, expertise at D+1',
        3: 'Automatic station, real-time acquisition, delayed expertise (up to M+21 days)',
        4: 'Manual climatological station or automatic station, delayed acquisition, delayed expertise (up to M+21 days)',
        5: 'Station with real-time or delayed acquisition, non-expertised or data expertise not guaranteed',
    };

    if (type === null || type === undefined || !(type in stationTypes)) {
        return 'Unknown station type';
    }

    return stationTypes[type];
};
