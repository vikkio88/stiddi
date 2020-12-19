export const ANGLES = {
    DEG_0: 0,
    DEG_45: 45,
    DEG_90: 90,
    DEG_135: 135,
    DEG_180: 180,
    DEG_225: 225,
    DEG_270: 270,
    DEG_315: 315,
    DEG_360: 360,
};

const NEGATIVE_ANGLES = {
    [ANGLES.DEG_0]: 0,
    [ANGLES.DEG_45]: -315,
    [ANGLES.DEG_90]: -270,
    [ANGLES.DEG_135]: -225,
    [ANGLES.DEG_180]: -180,
    [ANGLES.DEG_225]: -135,
    [ANGLES.DEG_270]: -90,
    [ANGLES.DEG_315]: -45,
    [ANGLES.DEG_360]: -360,
};

export const Angle = {
    shortestRotation(currentAngle, wantedAngle) {
        const currentNegative = currentAngle - ANGLES.DEG_360;
        const negativeAngle = (wantedAngle - ANGLES.DEG_360);
        const positiveRotation = currentAngle < wantedAngle ?
            wantedAngle - currentAngle :
            ANGLES.DEG_360 - currentAngle + wantedAngle;
        const negativeRotation = currentNegative > negativeAngle ?
            Math.abs(currentNegative - negativeAngle) :
            ANGLES.DEG_360 + currentAngle - wantedAngle;
        return {
            /*
            pos: positiveRotation,
            neg: negativeRotation,
            */
            rotation: (positiveRotation <= negativeRotation ? positiveRotation : negativeRotation) % ANGLES.DEG_360,
            angle: positiveRotation <= negativeRotation ? wantedAngle : negativeAngle
        };
    }
};