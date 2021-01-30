export const C = 299_792_458;
export const C_kmh = 1_080_000_000;

export const METRICS = {
    DISTANCE: {
        LS: 'light_seconds',
        M: 'metres',
        KM: 'kilometres',
        MM: 'megametres',
    },
    SPEED: {
        M_SECOND: 'metres_seconds',
        KM_HOURS: 'km_hours',
        C: 'speed_of_light'
    },
    TIME: {
        S: 'seconds',
        M: 'minutes',
        H: 'hours',
        D: 'days',
        Mo: 'months',
        Y: 'years'
    }

};

export const METRICS_CONVERSION_MATRIX = {
    // DISTANCE
    [METRICS.DISTANCE.LS]: {
        [METRICS.DISTANCE.LS]: 1,
        [METRICS.DISTANCE.M]: C,
        [METRICS.DISTANCE.KM]: C / 1000,
        [METRICS.DISTANCE.MM]: C / 1_000_000,
    },
    [METRICS.DISTANCE.M]: {
        [METRICS.DISTANCE.LS]: 1 / C,
        [METRICS.DISTANCE.M]: 1,
        [METRICS.DISTANCE.KM]: 1 / 1000,
        [METRICS.DISTANCE.MM]: 1 / 1_000_000,
    },
    [METRICS.DISTANCE.KM]: {
        [METRICS.DISTANCE.LS]: 1 / C * 1000,
        [METRICS.DISTANCE.M]: 1000,
        [METRICS.DISTANCE.KM]: 1,
        [METRICS.DISTANCE.MM]: 1 / 1000,
    },
    [METRICS.DISTANCE.MM]: {
        [METRICS.DISTANCE.LS]: 1 / C * 1_000_000,
        [METRICS.DISTANCE.M]: 1_000_000_000,
        [METRICS.DISTANCE.KM]: 1_000,
        [METRICS.DISTANCE.MM]: 1,
    },

    //SPEED
    [METRICS.SPEED.M_SECOND]: {
        [METRICS.SPEED.M_SECOND]: 1,
        [METRICS.SPEED.KM_HOURS]: 3.6,
        [METRICS.SPEED.C]: 1 / C,
    },
    [METRICS.SPEED.KM_HOURS]: {
        [METRICS.SPEED.M_SECOND]: 1 / 3.6,
        [METRICS.SPEED.KM_HOURS]: 1,
        [METRICS.SPEED.C]: C_kmh,
    },
    [METRICS.SPEED.C]: {
        [METRICS.SPEED.M_SECOND]: 1,
        [METRICS.SPEED.KM_HOURS]: C_kmh,
        [METRICS.SPEED.C]: 1,
    },

    //TIME
    [METRICS.TIME.S]: {
        [METRICS.TIME.S]: 1,
        [METRICS.TIME.M]: 1 / 60,
        [METRICS.TIME.H]: 1 / (60 * 60),
        [METRICS.TIME.D]: 1 / (60 * 60 * 24),
        [METRICS.TIME.Mo]: 1 / (60 * 60 * 24 * 30),
        [METRICS.TIME.Y]: 1 / (60 * 60 * 24 * 30 * 12),
    },
    [METRICS.TIME.M]: {
        [METRICS.TIME.S]: 60,
        [METRICS.TIME.M]: 1,
        [METRICS.TIME.H]: 1 / 60,
        [METRICS.TIME.D]: 1 / (60 * 24),
        [METRICS.TIME.Mo]: 1 / (60 * 24 * 30),
        [METRICS.TIME.Y]: 1 / (60 * 24 * 30 * 12),
    },
    [METRICS.TIME.H]: {
        [METRICS.TIME.S]: 60 * 60,
        [METRICS.TIME.M]: 60,
        [METRICS.TIME.H]: 1,
        [METRICS.TIME.D]: 1 / 24,
        [METRICS.TIME.Mo]: 1 / (24 * 30),
        [METRICS.TIME.Y]: 1 / (24 * 30 * 12),
    },
    [METRICS.TIME.D]: {
        [METRICS.TIME.S]: 60 * 60 * 24,
        [METRICS.TIME.M]: 60 * 24,
        [METRICS.TIME.H]: 24,
        [METRICS.TIME.D]: 1,
        [METRICS.TIME.Mo]: 1 / 30,
        [METRICS.TIME.Y]: 1 / (30 * 12),
    },
    [METRICS.TIME.Mo]: {
        [METRICS.TIME.S]: 60 * 60 * 24 * 30,
        [METRICS.TIME.M]: 60 * 24 * 30,
        [METRICS.TIME.H]: 24 * 30,
        [METRICS.TIME.D]: 30,
        [METRICS.TIME.Mo]: 1,
        [METRICS.TIME.Y]: 1 / 12,
    },
    [METRICS.TIME.Y]: {
        [METRICS.TIME.S]: 60 * 60 * 24 * 30 * 12,
        [METRICS.TIME.M]: 60 * 24 * 30 * 12,
        [METRICS.TIME.H]: 24 * 30 * 12,
        [METRICS.TIME.D]: 30 * 12,
        [METRICS.TIME.Mo]: 12,
        [METRICS.TIME.Y]: 1,
    },
};

export const METRICS_SYMBOLS = {
    [METRICS.DISTANCE.LS]: 'Ls',
    [METRICS.DISTANCE.M]: 'm',
    [METRICS.DISTANCE.KM]: 'km',
    [METRICS.DISTANCE.MM]: 'Mm',

    [METRICS.SPEED.M_SECOND]: 'm/s',
    [METRICS.SPEED.KM_HOURS]: 'km/h',
    [METRICS.SPEED.C]: 'c',

    [METRICS.TIME.S]: 'sec',
    [METRICS.TIME.M]: 'min',
    [METRICS.TIME.H]: 'hours',
    [METRICS.TIME.D]: 'days',
    [METRICS.TIME.Mo]: 'mnts',
    [METRICS.TIME.Y]: 'y',
};

const ETA_MAPPING = {
    [METRICS.DISTANCE.LS]: {
        [METRICS.SPEED.M_SECOND]: { m: C, from: METRICS.TIME.S, to: METRICS.TIME.H },
        [METRICS.SPEED.C]: { m: 1, from: METRICS.TIME.S, to: METRICS.TIME.S },
    }
};

export class Scalar {
    constructor(value, unit) {
        this.value = value;
        this.unit = unit;
    }

    static fromJs({ value, unit }) {
        return new Scalar(value, unit);
    }

    toJs() {
        const [value, unit] = this.get();
        return {
            value, unit
        };
    }

    get() {
        return [this.value, this.unit];
    }
}

export const Physics = {
    // distance in 
    calculateETA(distance, speed, forcedUnit = null) {
        const dUnit = distance.unit;
        const sUnit = speed.unit;

        const { m, from, to } = ETA_MAPPING[dUnit][sUnit];
        const mutiplied = distance.value * m;
        const plainValue = mutiplied / speed.value;

        const targetUnit = forcedUnit ? forcedUnit : to;
        return this.convert(plainValue, from, targetUnit);
    },
    convert(value, measure, toMeasure) {
        if (!Object.keys(METRICS_CONVERSION_MATRIX).includes(measure)) {
            console.error(`Invalid mesure from ${measure}`);
            return NaN;
        }

        if (!Object.keys(METRICS_CONVERSION_MATRIX[measure]).includes(toMeasure)) {
            console.error(`Invalid mesure to ${toMeasure} (from ${measure})`);
            return NaN;
        }

        const multiplier = METRICS_CONVERSION_MATRIX[measure][toMeasure];

        value = value * multiplier;
        return Scalar.fromJs({ value, unit: toMeasure });

    }
};