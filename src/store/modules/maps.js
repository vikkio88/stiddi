import eBridge, { EVENTS } from 'libs/eventBridge';
import { systemGenerator } from 'libs/game/maps';
import { randomizer } from 'libs/random';

const initialState = {
    system: systemGenerator.generate({ planetsNumber: randomizer.int(0, 12) })
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
        const { position: { system: playerPosition } } = player;
        const { system } = maps;
        eBridge.emit(EVENTS.GAME.MAPS.DRAW_SYSTEM, { system, player: { ...playerPosition } });
    });

    store.on('maps:zoomSystem', (_, { out = true, reset = false, level = null } = {}) => {
        eBridge.emit(EVENTS.GAME.MAPS.ZOOM_SYSTEM, { out, reset, level });
    });

    store.on('maps:focusSystem', (_, { object = 'stars', index = 0 } = {}) => {
        eBridge.emit(EVENTS.GAME.MAPS.FOCUS_SYSTEM, { object, index });
    });

    store.on('maps:clearSystem', () => {
        eBridge.emit(EVENTS.GAME.MAPS.CLEAR_SYSTEM);
    });
};

export default maps;