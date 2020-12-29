import Phaser from "phaser";

export const C = 299_792_458;

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
    negativeAngle(angle) {
        return angle - ANGLES.DEG_360;
    },
    shortestRotation(currentAngle, wantedAngle) {
        const currentNegative = this.negativeAngle(currentAngle);
        const negativeAngle = this.negativeAngle(wantedAngle);
        const positiveRotation = currentAngle < wantedAngle ?
            wantedAngle - currentAngle :
            ANGLES.DEG_360 - currentAngle + wantedAngle;
        const negativeRotation = currentNegative > negativeAngle ?
            Math.abs(currentNegative - negativeAngle) :
            ANGLES.DEG_360 + currentAngle - wantedAngle;

        const clockwise = positiveRotation <= negativeRotation;
        return {
            clockwise,
            currentNegative,
            negativeAngle,
            rotation: Math.abs((clockwise ? positiveRotation : negativeRotation) % ANGLES.DEG_360),
            angle: clockwise ? wantedAngle : negativeAngle
        };
    }
};

export const Geom = {
    pointOnCircumference(center, radius, angle, offset = -90) {
        angle = Phaser.Math.DegToRad(angle + offset);
        const { cx, cy } = center;

        return {
            x: (cx + radius * Math.cos(angle)),
            y: (cy + radius * Math.sin(angle)),
        };
    }
};