import eBridge, { EVENTS } from 'libs/eventBridge';

const effects = store => {
    store.on('effects:shake', (props, { duration = 2000, intensity = 'little' } = {}) => {
        const intensityClass = `shake-${intensity}`;
        document.getElementById('ui').classList.add(intensityClass);
        document.getElementById('porthole').classList.add(intensityClass);
        eBridge.emit(EVENTS.GAME.EFFECTS.SHAKE, { duration });
        setTimeout(() => {
            document.getElementById('ui').classList.remove(intensityClass);
            document.getElementById('porthole').classList.remove(intensityClass);
        }, duration);
    });
};

export default effects;