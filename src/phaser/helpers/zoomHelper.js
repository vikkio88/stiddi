export const zoomHelper = {
    scalePlanet(zoomLevel) {
        return Math.max(10 - zoomLevel, 1);
    },
    scaleShip(zoomLevel) {
        return Math.max(3 - zoomLevel, .3);
    }
}