import { Angle } from 'libs/math';


const ROTATIONS = [
    { currentAngle: 0, wantedAngle: 0, expectedAngle: 0, expectedRotation: 0, currentNegative: -360, negativeAngle: -360, clockwise: true },
    { currentAngle: 0, wantedAngle: 45, expectedAngle: 45, expectedRotation: 45, currentNegative: -360, negativeAngle: -315, clockwise: true },
    { currentAngle: 180, wantedAngle: 90, expectedAngle: -270, expectedRotation: 90, currentNegative: -180, negativeAngle: -270, clockwise: false },
    { currentAngle: 0, wantedAngle: 315, expectedAngle: -45, expectedRotation: 45, currentNegative: -360, negativeAngle: -45, clockwise: false },
    { currentAngle: 315, wantedAngle: 180, expectedAngle: -180, expectedRotation: 135, currentNegative: -45, negativeAngle: -180, clockwise: false },
    { currentAngle: 180, wantedAngle: 270, expectedAngle: 270, expectedRotation: 90, currentNegative: -180, negativeAngle: -90, clockwise: true },
    { currentAngle: 90, wantedAngle: 45, expectedAngle: -315, expectedRotation: 45, currentNegative: -270, negativeAngle: -315, clockwise: false },
];

describe('Angle helper', () => {
    describe.each(ROTATIONS)('Shortest Rotation', rotation => {
        it('matches the expected rotation', () => {
            const { currentAngle, wantedAngle,
                expectedAngle, expectedRotation,
                clockwise, currentNegative, negativeAngle
            } = rotation;
            expect(Angle.shortestRotation(currentAngle, wantedAngle)).toEqual({
                angle: expectedAngle,
                rotation: expectedRotation,
                clockwise,
                negativeAngle,
                currentNegative
            });
        });
    });
});