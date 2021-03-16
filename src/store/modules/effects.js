import eBridge, { EVENTS } from 'libs/eventBridge';
import ACTIONS from "store/actions";

const effects = store => {
    store.on(ACTIONS.EFFECTS.SHAKE, (_, { duration = 2000, intensity = 'little' } = {}) => {
        const intensityClass = `shake`;
        document.getElementById('ui').classList.add(intensityClass);
        document.getElementById('porthole').classList.add(intensityClass);
        eBridge.emit(EVENTS.GAME.EFFECTS.SHAKE, { duration });
        setTimeout(() => {
            document.getElementById('ui').classList.remove(intensityClass);
            document.getElementById('porthole').classList.remove(intensityClass);
        }, duration);
    });

    store.on(ACTIONS.EFFECTS.SQUARE_PORTHOLE, () => {
        document.getElementById('porthole').classList.add('squared');
    });

    store.on(ACTIONS.EFFECTS.ROUND_PORTHOLE, () => {
        document.getElementById('porthole').classList.remove('squared');
    });
};

export default effects;