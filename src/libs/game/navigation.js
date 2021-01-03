import { randomizer } from "../random";
export const FUEL_MULTIPLIER = .2;
export const calculateFuelCost = (burnTimeout, throttle) => {
    const burned = (FUEL_MULTIPLIER * (burnTimeout / 1000) * throttle);
    return (
        burned +
        // Adding some random cost
        (randomizer.chance(50) ? -1 : 1) * (randomizer.int(1, 10) / 100 * burned)
    );
};

export const calculateFullStopTimeout = speed => {
    return speed / .5 * 1000;
};