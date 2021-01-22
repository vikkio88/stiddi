export const SCENES = {
    NAVIGATION: 'Navigation',
    SYSTEM_MAP: 'SystemMap',
    GALAXY_MAP: 'GalaxyMap',
};


export const TABS = {
    NAVIGATION: 'navigation',
    MAPS: 'maps',
};

export const NAVIGATION_SUB_TABS = {
    SUBLIGHT: 'sublight',
    HYPER_DRIVE: 'hyperdrive',
    WARP_DRIVE: 'warpdrive',
};

export const SCENES_MAP = {
    [TABS.NAVIGATION]: SCENES.NAVIGATION,
    // initial scene for Maps is System
    [TABS.MAPS]: SCENES.SYSTEM_MAP
};