import { MAPS } from 'enums/ui';
import eBridge, { EVENTS } from 'libs/eventBridge';
import { SystemGenerator } from 'libs/game/maps';
import { getSeededRandomizer } from 'libs/random';

const TEST_SEED = null;
const randomizer = getSeededRandomizer(TEST_SEED);
const systemGenerator = new SystemGenerator(TEST_SEED);

const initialState = {
    currentMap: MAPS.SECTOR_MAP,
    system: systemGenerator.generate({ planetsNumber: randomizer.int(0, 16) })
};

const maps = store => {
    store.on('@init', () => {
        return {
            maps: {
                ...initialState
            }
        };
    });

    store.on('maps:drawSystem', ({ player, maps }) => {
        const { position: { system: playerPosition }, target, route } = player;
        const { system } = maps;
        eBridge.emit(EVENTS.GAME.MAPS.DRAW_SYSTEM, { system, player: { ...playerPosition }, target, route });
    });

    store.on('maps:zoomSystem', (_, { out = true, reset = false, level = null } = {}) => {
        eBridge.emit(EVENTS.GAME.MAPS.ZOOM_SYSTEM, { out, reset, level });
    });

    store.on('maps:focusSystem', (_, { object = 'stars', index = 0 } = {}) => {
        eBridge.emit(EVENTS.GAME.MAPS.FOCUS_SYSTEM, { object, index });
    });

    store.on('maps:plotSystem', (_, payload) => {
        eBridge.emit(EVENTS.GAME.MAPS.PLOTROUTE_SYSTEM, payload);
    });

    store.on('maps:clearPlotSystem', (_, payload) => {
        eBridge.emit(EVENTS.GAME.MAPS.CLEAR_PLOTROUTE_SYSTEM, payload);
    });

    store.on('maps:updatePlayerPosSystem', (_, payload) => {
        eBridge.emit(EVENTS.GAME.MAPS.UPDATE_PLAYER, payload);
    });

    store.on('maps:clearSystem', () => {
        eBridge.emit(EVENTS.GAME.MAPS.CLEAR_SYSTEM);
    });


    store.on('maps:mapTabChange', ({ maps }, { tab }) => {
        return {
            maps: {
                ...maps,
                currentMap: tab
            }
        };
    });
};

export default maps;