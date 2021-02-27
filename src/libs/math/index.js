import Phaser from "phaser";

export * from "./physics";

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

export const Numbers = {
    kFormat(number) {
        if (number >= 1000000000) {
            return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'b';
        }
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
        }
        if (number >= 1000) {
            return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return number.toFixed(2);
    }
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
    },
    headingAngleFromRad(rad) {
        const angle = this.normalised(Phaser.Math.RadToDeg(rad) + ANGLES.DEG_90);
        return Math.floor(angle);
    },
    normalised(deg) {
        if (deg === null) return null;
        return (deg + ANGLES.DEG_360) % ANGLES.DEG_360;
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
    },
    distance(angle, radius, p2) {
        const point = this.pointOnCircumference({ cx: 0, cy: 0 }, radius, angle);
        return Phaser.Math.Distance.BetweenPoints(p2, point);
    },
    distancePoints(p1, p2) {
        return Phaser.Math.Distance.BetweenPoints(p1, p2);
    },
    angleBetween(p1, p2) {
        return Angle.headingAngleFromRad(Phaser.Math.Angle.BetweenPoints(p1, p2));
    },
    pointOnLine(p1, p2, perc = 0) {
        const { x, y } = Phaser.Geom.Line.GetPoint({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y }, perc);
        return { x, y };
    }

};

export const Coords = {
    make(x, y) {
        return { x, y };
    },
    zerify({ x = 0, y = 0 } = {}) {
        return { x0: x, y0: y };
    },
    centrify({ x = 0, y = 0 } = {}) {
        return {
            cx: x,
            cy: y
        };
    },
    relativeCoords({ x, y }, { x0 = 0, y0 = 0 } = {}) {
        return {
            x: x - x0,
            y: y - y0
        };
    }
};
