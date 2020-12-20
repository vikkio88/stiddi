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
            rotation: (positiveRotation <= negativeRotation ? positiveRotation : negativeRotation) % ANGLES.DEG_360,
            angle: positiveRotation <= negativeRotation ? wantedAngle : negativeAngle
        };
    }
};