import ACTIONS from "store/actions";
import { MAPS } from 'enums/ui';
import eBridge, { EVENTS } from 'libs/eventBridge';
import { SystemGenerator } from 'libs/game/maps';
import { getSeededRandomizer } from 'libs/random';

const TEST_SEED = null;
const randomizer = getSeededRandomizer(TEST_SEED);
const systemGenerator = new SystemGenerator(TEST_SEED);

const initialState = {
    currentMap: MAPS.SECTOR_MAP,
    system: systemGenerator.generate({ planetsNumber: randomizer.int(0, 16) }),
    sector: { someStuff: 'stuff' },
};

const maps = store => {
    store.on('@init', () => {
        return {
            maps: {
                ...initialState
            }
        };
    });

    // System Map 
    store.on(ACTIONS.MAPS.SYSTEM.DRAW, ({ player, maps }) => {
        const { position: { system: playerPosition }, target, route } = player;
        const { system } = maps;
        eBridge.emit(EVENTS.GAME.MAPS.DRAW_SYSTEM, { system, player: { ...playerPosition }, target, route });
    });

    store.on(ACTIONS.MAPS.SYSTEM.ZOOM, (_, { out = true, reset = false, level = null } = {}) => {
        eBridge.emit(EVENTS.GAME.MAPS.ZOOM_SYSTEM, { out, reset, level });
    });

    store.on(ACTIONS.MAPS.SYSTEM.FOCUS, (_, { object = 'stars', index = 0 } = {}) => {
        eBridge.emit(EVENTS.GAME.MAPS.FOCUS_SYSTEM, { object, index });
    });

    store.on(ACTIONS.MAPS.SYSTEM.PLOT, (_, payload) => {
        eBridge.emit(EVENTS.GAME.MAPS.PLOTROUTE_SYSTEM, payload);
    });

    store.on(ACTIONS.MAPS.SYSTEM.CLEAR_PLOT, (_, payload) => {
        eBridge.emit(EVENTS.GAME.MAPS.CLEAR_PLOTROUTE_SYSTEM, payload);
    });

    store.on(ACTIONS.MAPS.SYSTEM.UPDATE_PLAYER_POS, (_, payload) => {
        eBridge.emit(EVENTS.GAME.MAPS.UPDATE_PLAYER, payload);
    });

    store.on(ACTIONS.MAPS.SYSTEM.CLEAR, () => {
        eBridge.emit(EVENTS.GAME.MAPS.CLEAR_SYSTEM);
    });

    // Sector Map
    store.on(ACTIONS.MAPS.SECTOR.UPDATE, ({ navigation, maps }) => {
        const { position } = navigation;
        const { sector } = maps;

        eBridge.emit(EVENTS.GAME.MAPS.SECTOR.SET, { position, sector });
    });


    store.on(ACTIONS.MAPS.MAP.TAB_CHANGE, ({ maps }, { tab }) => {
        return {
            maps: {
                ...maps,
                currentMap: tab
            }
        };
    });
};

export default maps;