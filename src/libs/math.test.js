import { Angle } from 'libs/math';


const ROTATIONS = [
    { currentAngle: 0, wantedAngle: 0, expectedAngle: 0, expectedRotation: 0 },
    { currentAngle: 0, wantedAngle: 45, expectedAngle: 45, expectedRotation: 45 },
    { currentAngle: 180, wantedAngle: 90, expectedAngle: -270, expectedRotation: 90 },
    { currentAngle: 0, wantedAngle: 315, expectedAngle: -45, expectedRotation: 45 },
    { currentAngle: 315, wantedAngle: 180, expectedAngle: -180, expectedRotation: 135 },
];

describe('Angle helper', () => {
    describe.each(ROTATIONS)('Shortest Rotation', rotation => {
        it('matches the expected rotation', () => {
            const { currentAngle, wantedAngle, expectedAngle, expectedRotation } = rotation;
            expect(Angle.shortestRotation(currentAngle, wantedAngle)).toEqual({
                angle: expectedAngle,
                rotation: expectedRotation
            });
        });
    });
});