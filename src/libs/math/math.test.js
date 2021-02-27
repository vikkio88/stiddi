import "jest-canvas-mock";
import { Angle, C, C_kmh, Geom, METRICS, Physics, Scalar } from 'libs/math';

describe('Angle helper', () => {
    const ROTATIONS = [
        { currentAngle: 0, wantedAngle: 0, expectedAngle: 0, expectedRotation: 0, currentNegative: -360, negativeAngle: -360, clockwise: true },
        { currentAngle: 0, wantedAngle: 45, expectedAngle: 45, expectedRotation: 45, currentNegative: -360, negativeAngle: -315, clockwise: true },
        { currentAngle: 180, wantedAngle: 90, expectedAngle: -270, expectedRotation: 90, currentNegative: -180, negativeAngle: -270, clockwise: false },
        { currentAngle: 0, wantedAngle: 315, expectedAngle: -45, expectedRotation: 45, currentNegative: -360, negativeAngle: -45, clockwise: false },
        { currentAngle: 315, wantedAngle: 180, expectedAngle: -180, expectedRotation: 135, currentNegative: -45, negativeAngle: -180, clockwise: false },
        { currentAngle: 180, wantedAngle: 270, expectedAngle: 270, expectedRotation: 90, currentNegative: -180, negativeAngle: -90, clockwise: true },
        { currentAngle: 90, wantedAngle: 45, expectedAngle: -315, expectedRotation: 45, currentNegative: -270, negativeAngle: -315, clockwise: false },
    ];

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


describe('Geom helper', () => {
    const POINTS = [
        { p1: { x: 0, y: 0 }, p2: { x: 0, y: 2 }, perc: 1, expected: { x: 0, y: 2 } },
        { p1: { x: 0, y: 0 }, p2: { x: 0, y: 2 }, perc: .5, expected: { x: 0, y: 1 } },
        { p1: { x: 0, y: 1 }, p2: { x: 0, y: 2 }, perc: 0, expected: { x: 0, y: 1 } },
    ];

    describe.each(POINTS)('point on line by percentage', ({ p1, p2, perc, expected }) => {
        expect(Geom.pointOnLine(p1, p2, perc)).toEqual(expected);
    });
});

describe('Physics helper', () => {
    const ETA_VALUES = [
        { d: 1, dU: METRICS.DISTANCE.LS, s: C, sU: METRICS.SPEED.M_SECOND, f: METRICS.TIME.S, eU: METRICS.TIME.S, eV: 1 },
        { d: 900, dU: METRICS.DISTANCE.LS, s: 50, sU: METRICS.SPEED.M_SECOND, f: null, eU: METRICS.TIME.H, eV: 1498962.29 },
        { d: 900, dU: METRICS.DISTANCE.LS, s: 50, sU: METRICS.SPEED.M_SECOND, f: METRICS.TIME.D, eU: METRICS.TIME.D, eV: 62456.76 },
        { d: 900, dU: METRICS.DISTANCE.LS, s: 50, sU: METRICS.SPEED.M_SECOND, f: METRICS.TIME.Y, eU: METRICS.TIME.Y, eV: 173.49 },
        { d: 900, dU: METRICS.DISTANCE.LS, s: 1, sU: METRICS.SPEED.C, f: METRICS.TIME.S, eU: METRICS.TIME.S, eV: 900 },
        { d: 900, dU: METRICS.DISTANCE.LS, s: .5, sU: METRICS.SPEED.C, f: METRICS.TIME.S, eU: METRICS.TIME.S, eV: 1800 },
        { d: 20_000, dU: METRICS.DISTANCE.LS, s: 20, sU: METRICS.SPEED.C, f: METRICS.TIME.M, eU: METRICS.TIME.M, eV: 16.666 },
        { d: 20_000, dU: METRICS.DISTANCE.LS, s: 100, sU: METRICS.SPEED.C, f: METRICS.TIME.M, eU: METRICS.TIME.M, eV: 3.33 },
        { d: 20_000, dU: METRICS.DISTANCE.LS, s: 200, sU: METRICS.SPEED.C, f: METRICS.TIME.M, eU: METRICS.TIME.M, eV: 1.666 },
    ];

    describe.each(ETA_VALUES)('calculating ETA', etas => {
        it('it returns the correct value', () => {
            const { d, dU, s, sU, f, eU, eV } = etas;
            const eta = Physics.calculateETA(
                // Distance
                Scalar.fromJs({ value: d, unit: dU }),
                // Speed
                Scalar.fromJs({ value: s, unit: sU }),
                // forced Unit
                f
            );
            expect(eta instanceof Scalar).toBe(true);
            expect(eta.unit).toEqual(eU);
            expect(eta.value).toBeCloseTo(eV);
        });
    });

    const CONVERSION_VALUES = [
        { value: 1, measure: METRICS.DISTANCE.LS, toMeasure: METRICS.DISTANCE.M, expectedValue: C, expectedMesure: METRICS.DISTANCE.M },
        { value: 1000, measure: METRICS.DISTANCE.M, toMeasure: METRICS.DISTANCE.KM, expectedValue: 1, expectedMesure: METRICS.DISTANCE.KM },

        { value: 3600, measure: METRICS.TIME.S, toMeasure: METRICS.TIME.H, expectedValue: 1, expectedMesure: METRICS.DISTANCE.H },
        { value: 30, measure: METRICS.TIME.S, toMeasure: METRICS.TIME.S, expectedValue: 30, expectedMesure: METRICS.DISTANCE.S },
        { value: 30, measure: METRICS.TIME.D, toMeasure: METRICS.TIME.Mo, expectedValue: 1, expectedMesure: METRICS.DISTANCE.Mo },
        { value: 60, measure: METRICS.TIME.D, toMeasure: METRICS.TIME.Mo, expectedValue: 2, expectedMesure: METRICS.DISTANCE.Mo },
        { value: 360, measure: METRICS.TIME.D, toMeasure: METRICS.TIME.Y, expectedValue: 1, expectedMesure: METRICS.DISTANCE.Y },

        { value: 1, measure: METRICS.SPEED.M_SECOND, toMeasure: METRICS.SPEED.KM_HOURS, expectedValue: 3.6, expectedMesure: METRICS.SPEED.KM_HOURS },
        { value: 1, measure: METRICS.SPEED.C, toMeasure: METRICS.SPEED.KM_HOURS, expectedValue: C_kmh, expectedMesure: METRICS.SPEED.KM_HOURS },
    ];

    describe.each(CONVERSION_VALUES)('conversion', conversion => {
        it('converts to the right unit', () => {
            const { value, measure, toMeasure, expectedValue, expectedMesure } = conversion;
            const converted = Physics.convert(value, measure, toMeasure);
            expect(converted.value).toBe(expectedValue);
            if (expectedMesure) {
                expect(converted.unit).toBe(expectedMesure);
            }
        });
    });
});