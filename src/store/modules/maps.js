import eBridge, { EVENTS } from 'libs/eventBridge';
import { systemGenerator } from 'libs/game/maps';

const maps = store => {
    store.on('maps:drawSystem', ({ player }) => {
        //const { system } = player;
        const system = systemGenerator.generate();

        eBridge.emit(EVENTS.GAME.MAPS.DRAW_SYSTEM, { system });
    });

    store.on('maps:zoomSystem', (_, { out = true } = {}) => {
        eBridge.emit(EVENTS.GAME.MAPS.ZOOM_SYSTEM, { out });
    });

    store.on('maps:clearSystem', () => {
        eBridge.emit(EVENTS.GAME.MAPS.CLEAR_SYSTEM);
    });
};

export default maps;