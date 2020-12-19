import { Angle } from 'libs/math';

describe('Angle helper', () => {
    describe('Shortest Rotation', () => {
        it('matches the expected rotation', () => {
            let currentAngle = 0;
            let wantedAngle = 0;
            let expectedRotation = 0;
            expect(Angle.shortestRotation(currentAngle, wantedAngle)).toBe(expectedRotation);

            currentAngle = 0;
            wantedAngle = 45;
            expectedRotation = 45;
            expect(Angle.shortestRotation(currentAngle, wantedAngle)).toBe(expectedRotation);

            currentAngle = 180;
            wantedAngle = 90;
            expectedRotation = -270;
            expect(Angle.shortestRotation(currentAngle, wantedAngle)).toBe(expectedRotation);
        });
    });
});