import { randomizer } from "libs/random";

export const systemGenerator = {
    getRadius(min, max) {
        return randomizer.int(min, max);
    },
    generate({ seed = 1, maxStars = 1, name = "Sol", planets = 8 } = {}) {
        return {
            name: "",
            stars: [...Array(randomizer.int(1, maxStars)).keys()].map(id => this.getStar({ id })),
            planets: this.getPlanets({ planets })
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

    getPlanets({ planets }) {
        const generatedPlanets = [];
        let previousOffset = 0;
        for (let i = 0; i < planets; i++) {
            const offset = previousOffset + randomizer.int(80, 450);
            previousOffset = offset;
            generatedPlanets.push(this.getPlanet({ id: i, offset }));
        }

        return generatedPlanets;
    },
    getPlanet({ id, offset }) {
        return {
            id: `planet${id}`,
            name: `Planet Name ${id}`,
            colour: 0x0000ff,
            radius: this.getRadius(5, 20),
            offset,
            moons: []
        };
    }
};