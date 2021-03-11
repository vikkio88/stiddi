import eBridge, { EVENTS } from 'libs/eventBridge';

const effects = store => {
    store.on('effects:shake', (_, { duration = 2000, intensity = 'little' } = {}) => {
        const intensityClass = `shake`;
        document.getElementById('ui').classList.add(intensityClass);
        document.getElementById('porthole').classList.add(intensityClass);
        eBridge.emit(EVENTS.GAME.EFFECTS.SHAKE, { duration });
        setTimeout(() => {
            document.getElementById('ui').classList.remove(intensityClass);
            document.getElementById('porthole').classList.remove(intensityClass);
        }, duration);
    });

    store.on('effects:squarePorthole', () => {
        document.getElementById('porthole').classList.add('squared');
    });

    store.on('effects:roundPorthole', () => {
        document.getElementById('porthole').classList.remove('squared');
    });
};

export default effects;