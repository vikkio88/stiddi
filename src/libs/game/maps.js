import { randomizer } from "libs/random";

export const systemGenerator = {
    getRadius(min, max) {
        return randomizer.int(min, max);
    },
    generate({ seed = 1, maxStars = 1, name = "Sol", planets = 8 } = {}) {
        return {
            name: "",
            stars: [...Array(randomizer.int(1, maxStars)).keys()].map(id => this.getStar({ id })),
            planets: [...Array(randomizer.int(1, planets)).keys()].map(id => this.getPlanet({ id }))
        };
    },
    getStar({ id }) {
        return {
            id: `star${id}`,
            name: `Start Name ${id}`,
            colour: 0xff0000,
            radius: this.getRadius(10, 40),
        };
    },
    getPlanet({ id }) {
        return {
            id: `planet${id}`,
            name: `Planet Name ${id}`,
            colour: 0x0000ff,
            radius: this.getRadius(5, 20),
            offset: id + 100 + ((id + 1) * randomizer.int(20, 60)),
            moons: []
        };
    }
};