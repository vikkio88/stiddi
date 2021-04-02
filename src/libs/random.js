import seedrandom from "seedrandom";

export const getSeededRandomizer = seed => {
    let random = Math.random;
    if (seed) {
        random = seedrandom(seed);
    }

    return getRandomizer(random, seed || null);
};

export const getRandomizer = (random = Math.random, seed = null) => {
    return {
        seed,
        pickOne(array) {
            return array[this.int(0, array.length - 1)];
        },
        int(low, high) {
            return Math.round(random() * (high - low) + low);
        },
        chance(percentage) {
            return this.int(0, 99) < percentage;
        }
    };
};

export const randomizer = getRandomizer();