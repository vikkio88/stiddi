export const BODY_TYPES = {
    // plural as they define an array of them
    STAR: 'stars',
    PLANET: 'planets',

    MAP_INDICATOR: 'map_indicator',

    PLAYER: 'player'
};

export const ZOOM_LEVELS = [
    { label: '50%', level: .09 },
    { label: '80%', level: .2 },
    { label: '90%', level: .9 },
    { label: 'x2', level: 3 },
    { label: 'x3', level: 4 },
];

export const ZOOM_SCALES = {
    default: {
        planet: 1,
        ship: .3,
        star: 1,
    }
};
