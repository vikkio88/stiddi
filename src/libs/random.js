export const randomizer = {
    pickOne(array) {
        return array[randomizer.int(0, array.length - 1)];
    },
    int(low, high) {
        return Math.round(Math.random() * (high - low) + low);
    },
    chance(percentage) {
        return randomizer.int(0, 99) < percentage;
    },
    dice(faces = 6) {
        return randomizer.int(1, 6);
    }
};