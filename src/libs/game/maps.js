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
    BROWN_RED: 0xEB4B25,
    RED: 0xff0000,
    DARK_ORANGE: 0xFC9601,
    ORANGE_RED: 0xffcc6f,
    PALE_ORANGE: 0xFFCC33,
    PALE_YELLOW_ORANGE: 0xFFDAB5,
    PALE_YELLOW: 0xfff4ea,
    YELLOW_WHITE: 0xf8f7ff,
    WHITE_BLUE: 0xEEFEFF,
    BLUE_WHITE: 0xD5E0FF,
    DEEP_WHITE_BLUE: 0xA2C0FF,
};

const STAR_TYPES = {
    O: 'o_type',
    B: 'b_type',
    A: 'a_type',
    F: 'f_type',
    G: 'g_type',
    K: 'k_type',
    M: 'm_type',

    RED_DWARF: 'rd_type',
    BROWN_DWARF: 'bd_type',

    /*
        NEUTRON: 'neutron_type',
        BLACK_HOLE: 'black_hole',
    */

};

const STARS = {
    TYPES: {
        [STAR_TYPES.O]: {
            name: "o",
            colours: [COLOURS.DEEP_WHITE_BLUE, COLOURS.BLUE_WHITE, COLOURS.WHITE_BLUE],
            sizes: [70, 80]
        },
        [STAR_TYPES.B]: {
            name: "b",
            colours: [COLOURS.BLUE_WHITE, COLOURS.WHITE_BLUE],
            sizes: [60, 75]
        },
        [STAR_TYPES.A]: {
            name: "a",
            colours: [COLOURS.WHITE_BLUE],
            sizes: [55, 70]
        },
        [STAR_TYPES.F]: {
            name: "f",
            colours: [COLOURS.YELLOW_WHITE],
            sizes: [40, 70]
        },
        [STAR_TYPES.G]: {
            name: "g",
            colours: [COLOURS.PALE_YELLOW],
            sizes: [40, 60]
        },
        [STAR_TYPES.K]: {
            name: "k",
            colours: [COLOURS.PALE_YELLOW_ORANGE, COLOURS.PALE_ORANGE],
            sizes: [35, 55]
        },
        [STAR_TYPES.M]: {
            name: "m",
            colours: [COLOURS.ORANGE_RED, COLOURS.DARK_ORANGE],
            sizes: [20, 45]
        },
        [STAR_TYPES.RED_DWARF]: {
            name: "red_dwarf",
            colours: [COLOURS.RED, COLOURS.DARK_ORANGE],
            sizes: [15, 30]
        },
        [STAR_TYPES.BROWN_DWARF]: {
            name: "brown_dwarf",
            colours: [COLOURS.BROWN_RED],
            sizes: [10, 15]
        },
    }
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
            sizes: [3, 5],
        },
        [PLANET_TYPES.ROCKY]: {
            name: "rocky",
            colours: [COLOURS.DARK, COLOURS.GREY, COLOURS.REDISH],
            sizes: [3, 9],
        },
        [PLANET_TYPES.HABITABLE]: {
            name: "habitable",
            colours: [COLOURS.PALE_BLUE],
            sizes: [3, 14],
        },
        [PLANET_TYPES.ICY]: {
            name: "icy",
            colours: [COLOURS.WHITE],
            sizes: [6, 15],
        },
        [PLANET_TYPES.GAS_GIANT]: {
            name: "gas giant",
            colours: [COLOURS.YELLOW, COLOURS.DARK_BLUE],
            sizes: [15, 40],
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
        const type = this.randomizer.pickOne(Object.values(STAR_TYPES));
        const { name: typeName, colours, sizes } = STARS.TYPES[type];
        return {
            id: `s_${starName.replace(/\s/g, '')}_${index}`,
            index: index,
            name: starName,
            type: { description: typeName },
            colour: this.randomizer.pickOne(colours),
            radius: this.getRadius(sizes[0], sizes[1]),
        };
    }

    getPlanets({ planetsNumber, stars }) {
        const generatedPlanets = [];
        let previousOffset = 0;
        const star = stars[0];
        for (let i = 0; i < planetsNumber; i++) {
            const offset = (previousOffset + this.randomizer.int(80, 450))
                + (
                    this.randomizer.chance((i + 10) * 10) ?
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
