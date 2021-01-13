import { ANGLES } from "libs/math";
import { getSeededRandomizer } from "libs/random";

const letterFromIndex = index => String.fromCharCode((index + 1) + 64);

const COLOURS = {
    // Planets
    PALE_BLUE: 0x8CB1DE,
    GREY: 0x945B47,
    WHITE: 0xFBFCFF,
    YELLOW: 0xC5AB6E,
    DARK: 0x343E47,
    DARK_BLUE: 0x6081FF,
    REDISH: 0xE27B58,

    // Stars
    RED: 0xff0000,
    PALE_ORANGE: 0xFFCC33,
    DARK_ORANGE: 0xFC9601,
    WHITE_BLUE: 0xEEFEFF,
};

const PLANET_TYPES = {
    METAL: 'metal',
    ROCKY: 'rocky',
    HABITABLE: 'habitable',
    ICY: 'icy',
    GAS_GIANT: 'gas_giant',
};

const PLANET = {
    TYPES: {
        [PLANET_TYPES.METAL]: {
            name: "metal",
            colours: [COLOURS.DARK, COLOURS.GREY],
            sizes: [4, 5],
        },
        [PLANET_TYPES.ROCKY]: {
            name: "rocky",
            colours: [COLOURS.DARK, COLOURS.GREY, COLOURS.REDISH],
            sizes: [4, 9],
        },
        [PLANET_TYPES.HABITABLE]: {
            name: "habitable",
            colours: [COLOURS.PALE_BLUE],
            sizes: [4, 10],
        },
        [PLANET_TYPES.ICY]: {
            name: "icy",
            colours: [COLOURS.WHITE],
            sizes: [5, 10],
        },
        [PLANET_TYPES.GAS_GIANT]: {
            name: "gas giant",
            colours: [COLOURS.YELLOW, COLOURS.DARK_BLUE],
            sizes: [7, 20],
        },
    },
};

const PLANET_CONFIG = {
    RANGE: {
        0: [
            [80, PLANET_TYPES.METAL],
            PLANET_TYPES.ROCKY
        ],
        1: [
            [60, PLANET_TYPES.ROCKY],
            PLANET_TYPES.METAL
        ],
        2: [
            [90, PLANET_TYPES.ROCKY],
            PLANET_TYPES.HABITABLE
        ],
        3: [
            [70, PLANET_TYPES.ROCKY],
            PLANET_TYPES.ICY
        ],
        4: [
            [70, PLANET_TYPES.ICY],
            PLANET_TYPES.GAS_GIANT
        ],
        5: [
            [90, PLANET_TYPES.GAS_GIANT],
            PLANET_TYPES.ICY
        ],
        6: [
            [30, PLANET_TYPES.GAS_GIANT],
            PLANET_TYPES.METAL
        ],
        7: [
            [50, PLANET_TYPES.ICY],
            PLANET_TYPES.METAL
        ],
        default: [
            [50, PLANET_TYPES.METAL],
            PLANET_TYPES.ICY
        ]
    }
};
export class SystemGenerator {
    constructor(seed) {
        this.randomizer = getSeededRandomizer(seed);
    }

    generateSystemName() {
        const a = letterFromIndex(this.randomizer.int(1, 26));
        const b = letterFromIndex(this.randomizer.int(1, 26));
        const c = letterFromIndex(this.randomizer.int(1, 26));
        const d = letterFromIndex(this.randomizer.int(1, 26));
        return `${a}${b}${c}-${this.randomizer.int(1, 800)}${d}`;
    };



    getRadius(min, max) {
        return this.randomizer.int(min, max);
    }

    generate({ maxStars = 1, name = null, planetsNumber = 8 } = {}) {
        name = name ? name : this.generateSystemName();
        const stars = [...Array(this.randomizer.int(1, maxStars)).keys()].map(index => this.getStar({ index, name }));
        const planets = this.getPlanets({ planetsNumber, stars });
        return {
            name,
            stars,
            planets
        };
    }

    getStar({ index, name }) {
        const starName = `${name} ${letterFromIndex(index)}`;
        return {
            id: `s_${starName.replace(/\s/g, '')}_${index}`,
            index: index,
            name: starName,
            colour: this.randomizer.pickOne([
                COLOURS.RED,
                COLOURS.PALE_ORANGE,
                COLOURS.DARK_ORANGE,
                COLOURS.WHITE_BLUE,
            ]),
            radius: this.getRadius(10, 40),
        };
    }

    getPlanets({ planetsNumber, stars }) {
        const generatedPlanets = [];
        let previousOffset = 0;
        const star = stars[0];
        for (let i = 0; i < planetsNumber; i++) {
            const offset = (previousOffset + this.randomizer.int(80, 450))
                + (
                    this.randomizer.chance(i * 10) ?
                        this.randomizer.int(100, 300) : 0
                );
            previousOffset = offset;
            generatedPlanets.push(this.getPlanet({ index: i, offset, star }));
        }

        return generatedPlanets;
    }

    getPlanet({ index, offset, star }) {
        const typeName = this.getPlanetTypeByIndex(index);
        const type = PLANET.TYPES[typeName];
        const planetName = `${star.name} ${letterFromIndex(star.index + 1 + index).toLowerCase()}`;
        return {
            // ulid needs to be within seeded value
            id: `p_${planetName.replace(/\s/g, '')}_${index}`,
            index: index,
            // remember the naming when you make multiple stars
            name: planetName,
            colour: this.randomizer.pickOne(Object.values(type.colours)),
            radius: this.getRadius(type.sizes[0], type.sizes[1]),
            type: { name: typeName, description: type.name },

            // angle can variate because it is the position
            angle: this.randomizer.int(0, ANGLES.DEG_360),
            offset,
            moons: []
        };
    }

    getPlanetTypeByIndex(index) {
        const rangeConfig = PLANET_CONFIG.RANGE[index] || PLANET_CONFIG.RANGE.default;
        const [[percentage, mainType], fallback] = rangeConfig;
        return this.randomizer.chance(percentage) ? mainType : fallback;
    }
}
