import { calculateChargeTimeHD, calculateFuelCostHD, calculateCooldownTimeHD } from "./navigation";
describe('Hyperdrive helper', () => {
    const HD_TEST_DATA = [
        { distance: 1, speed: 1, expectedFuel: [8, 11], expectedCharge: [5, 6], expectedCooldown: [30, 32] },
        { distance: 100, speed: 1, expectedFuel: [8, 13], expectedCharge: [5, 6], expectedCooldown: [32, 34] },
        { distance: 100, speed: 5, expectedFuel: [8, 13], expectedCharge: [5, 6], expectedCooldown: [32, 34] },
        { distance: 100, speed: 30, expectedFuel: [10, 14], expectedCharge: [6, 10], expectedCooldown: [40, 41] },
        { distance: 100, speed: 40, expectedFuel: [13, 15], expectedCharge: [5, 8], expectedCooldown: [43, 45] },
        { distance: 100, speed: 100, expectedFuel: [10, 25], expectedCharge: [11, 13], expectedCooldown: [80, 82] },
        { distance: 10000, speed: 100, expectedFuel: [20, 62], expectedCharge: [12, 13], expectedCooldown: [89, 91] },
    ];

    describe.each(HD_TEST_DATA)('fuel', ({ distance, speed, expectedFuel: expected }) => {
        it('respects expected thresholds', () => {
            const cost = calculateFuelCostHD(distance, speed, true);
            expect(cost).toBeGreaterThanOrEqual(expected[0]);
            expect(cost).toBeLessThanOrEqual(expected[1]);
        });
    });

    describe.each(HD_TEST_DATA)('charge time', ({ distance, speed, expectedCharge: expected }) => {
        it('respects expected thresholds', () => {
            const cost = calculateChargeTimeHD(distance, speed, true);
            expect(cost).toBeGreaterThanOrEqual(expected[0]);
            expect(cost).toBeLessThanOrEqual(expected[1]);
        });
    });

    describe.each(HD_TEST_DATA)('cooldown time', ({ distance, speed, expectedCooldown: expected }) => {
        it('respects expected thresholds', () => {
            const cost = calculateCooldownTimeHD(distance, speed, true);
            expect(cost).toBeGreaterThanOrEqual(expected[0]);
            expect(cost).toBeLessThanOrEqual(expected[1]);
        });
    });

});