import { randomizer } from "../random";
export const FUEL_MULTIPLIER = .2;
// Thermal
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

// Hyperdrive
const HD_FUEL_MULT = { MIN: 10, TIME: 0.0009, SPEED: 0.009 };
export const calculateFuelCostHD = (distance, speed, noEntropy = false) => {
    const time = distance / speed;
    const burned = HD_FUEL_MULT.MIN * (Math.exp(HD_FUEL_MULT.TIME * time)) * (Math.exp(HD_FUEL_MULT.SPEED * speed));
    return (
        burned + (
            // Adding some random cost
            noEntropy ? 0 : (randomizer.chance(50) ? -1 : 1) * (randomizer.int(1, 10) / 100 * burned)
        )
    );
};

const HD_COOLDOWN_MULT = { MIN: 30, TIME: 0.001, SPEED: 0.010 };
export const calculateCooldownTimeHD = (distance, speed, noEntropy = false) => {
    const time = distance / speed;
    const cooldownTime = HD_COOLDOWN_MULT.MIN * (Math.exp(HD_COOLDOWN_MULT.TIME * time)) * (Math.exp(HD_COOLDOWN_MULT.SPEED * speed));
    return (
        cooldownTime + (
            // Adding some random cost
            noEntropy ? 0 : (randomizer.chance(50) ? -1 : 1) * (randomizer.int(1, 10) / 100 * cooldownTime)
        )
    );
};

const HD_CHARGE_MULT = { MIN: 5, K: 0.009 };
export const calculateChargeTimeHD = (_, speed, noEntropy = false) => {
    const chargeTime = HD_CHARGE_MULT.MIN * Math.exp(HD_CHARGE_MULT.K * speed);
    return (
        chargeTime + (
            // Adding some random cost
            noEntropy ? 0 : (randomizer.chance(50) ? -1 : 1) * (randomizer.int(1, 10) / 100 * chargeTime)
        )
    );
};

