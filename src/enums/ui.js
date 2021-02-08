export const SCENES = {
    NAVIGATION: 'Navigation',
    SYSTEM_MAP: 'SystemMap',
    GALAXY_MAP: 'GalaxyMap',
};


export const TABS = {
    NAVIGATION: 'navigation',
    SYSTEMS: 'systems',
    COMMS: 'comms',
    MAPS: 'maps',
};

export const SCENES_MAP = {
    [TABS.NAVIGATION]: SCENES.NAVIGATION,
    // initial scene for Maps is System
    [TABS.MAPS]: SCENES.SYSTEM_MAP
};