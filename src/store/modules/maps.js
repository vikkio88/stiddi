import eBridge, { EVENTS } from 'libs/eventBridge';
import { systemGenerator } from 'libs/game/maps';

const initialState = {
    system: systemGenerator.generate()
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
        //const { system } = player;
        const { system } = maps;
        eBridge.emit(EVENTS.GAME.MAPS.DRAW_SYSTEM, { system });
    });

    store.on('maps:zoomSystem', (_, { out = true, reset = false } = {}) => {
        eBridge.emit(EVENTS.GAME.MAPS.ZOOM_SYSTEM, { out, reset });
    });

    store.on('maps:focusSystem', (_, { object = 'stars', index = 0 } = {}) => {
        eBridge.emit(EVENTS.GAME.MAPS.FOCUS_SYSTEM, { object, index });
    });

    store.on('maps:clearSystem', () => {
        eBridge.emit(EVENTS.GAME.MAPS.CLEAR_SYSTEM);
    });
};

export default maps;