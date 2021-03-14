import { zoomHelper } from "./zoomHelper";
import { ZOOM_LEVELS } from "enums/systemMap";

const levels = ZOOM_LEVELS.map(({ level }) => level);

describe('zoomHelper', () => {
    describe.each(levels)('scaling', level => {
        it(`resize planets according to the zoom level: ${level}`, () => {
            const scale = zoomHelper.scalePlanet(level);
            expect(scale).toBeLessThanOrEqual(10);
            expect(scale).toBeGreaterThanOrEqual(1);
        });

        it(`resize ship according to the zoom level: ${level}`, () => {
            const scale = zoomHelper.scaleShip(level);
            expect(scale).toBeLessThanOrEqual(3);
            expect(scale).toBeGreaterThanOrEqual(.3);
        });
    });
});