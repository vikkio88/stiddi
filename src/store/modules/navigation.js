import eBridge, { EVENTS } from 'libs/eventBridge';

const initialState = {
    heading: 0,
    direction: 0,
    speed: 0,
    navigationLock: false
};

const navigation = store => {
    store.on('@init', () => {
        return {
            navigation: {
                ...initialState
            }
        };
    });

    store.on('phaser:heartbeat', ({ navigation }, payload) => {
        return {
            navigation: {
                ...navigation,
                ...payload
            }
        };
    });

    store.on('commit:burn', (_, { timeout, throttle }) => {
        store.dispatch('lock:navigation');
        store.dispatch('effects:shake', { duration: timeout });
        eBridge.emit(EVENTS.GAME.ACTIONS.BURN, { timeout, throttle });
    });

    store.on('commit:rotate', (_, { angle }) => {
        store.dispatch('lock:navigation');
        eBridge.emit(EVENTS.GAME.ACTIONS.ROTATE, { angle });
    });

    store.on('commit:fullstop', ({ navigation }) => {
        store.dispatch('lock:navigation');
        // here we need to calculate fuel usage related to current speed
        // and also the timeout
        const { speed } = navigation;
        console.log('stopping from', speed);
        const timeout = 3000;
        store.dispatch('effects:shake', { duration: timeout });
        setTimeout(() => {
            eBridge.emit(EVENTS.GAME.ACTIONS.FULL_STOP);
            store.dispatch('unlock:navigation');
        }, timeout);

    });

    store.on('lock:navigation', ({ navigation }) => {
        return {
            navigation: {
                ...navigation,
                navigationLock: true
            }
        };
    });

    store.on('unlock:navigation', ({ navigation }) => {
        return {
            navigation: {
                ...navigation,
                navigationLock: false
            }
        };
    });
};

export default navigation;