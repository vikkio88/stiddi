import { NAVIGATION_SUB_TABS } from 'enums/ui';
import eBridge, { EVENTS } from 'libs/eventBridge';
import { calculateFuelCost, calculateFullStopTimeout } from 'libs/game/navigation';

const initialState = {
    heading: 0,
    direction: 0,
    speed: 0,
    position: { x: 0, y: 0 },
    navigationLock: false,
    subtab: NAVIGATION_SUB_TABS.SUBLIGHT,
    settings: {
        heading: 0,
        throttle: 20,
        burnTime: 3
    }
};

const navigation = store => {
    store.on('@init', () => {
        return {
            navigation: {
                ...initialState
            }
        };
    });

    // can move this to proper action-emit-from-phaser
    store.on('phaser:heartbeat', ({ navigation }, payload) => {
        return {
            navigation: {
                ...navigation,
                ...payload
            }
        };
    });

    store.on('navigation:subtabChange', ({ navigation }, { subtab }) => {
        return {
            navigation: {
                ...navigation,
                subtab
            }
        };
    });

    store.on('commit:burn', (_, { timeout, throttle }) => {
        store.dispatch('lock:navigation');
        store.dispatch('effects:shake', { duration: timeout });
        const fuel = calculateFuelCost(timeout, throttle);
        store.dispatch('player:burnFuel', { fuel });
        eBridge.emit(EVENTS.GAME.ACTIONS.BURN, { timeout, throttle });
    });

    store.on('commit:rotate', (_, { angle }) => {
        store.dispatch('lock:navigation');
        eBridge.emit(EVENTS.GAME.ACTIONS.ROTATE, { angle });
    });

    store.on('commit:fullstop', ({ navigation }) => {
        store.dispatch('lock:navigation');
        const { speed } = navigation;
        const timeout = calculateFullStopTimeout(speed);
        const fuel = calculateFuelCost(timeout, .10);
        store.dispatch('effects:shake', { duration: timeout });
        store.dispatch('player:burnFuel', { fuel });
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

    store.on('navigation:storeSetting', ({ navigation }, settings) => {
        return {
            navigation: {
                ...navigation,
                settings: {
                    ...navigation.settings,
                    ...settings
                }
            }
        };
    });
};

export default navigation;