export function zoomAdjust(zoom: number): number {
    const scaleFactor = window.innerWidth < 768 ? 0.8 : 1;
    return parseFloat((zoom * scaleFactor).toFixed(1));
}
