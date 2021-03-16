import ACTIONS from "store/actions";
import { ENGINE_TYPES, HYPERDRIVE_ACTIONS } from "enums/navigation";
import eBridge, { EVENTS } from "libs/eventBridge";
import { calculateChargeTimeHD, calculateCooldownTimeHD, calculateFuelCost, calculateFuelCostHD, calculateFullStopTimeout } from "libs/game/navigation";
import { C, Geom } from "libs/math";
import { Time } from "libs/time";

const initialState = {
    heading: 0,
    direction: 0,
    speed: 0,
    position: { x: 0, y: 0 },
    navigationLock: false,
    selectedEngineType: ENGINE_TYPES.THERMAL,
    settings: {
        [ENGINE_TYPES.THERMAL]: {
            heading: 0,
            throttle: 20,
            burnTime: 3
        },
        [ENGINE_TYPES.HYPER_DRIVE]: {
            hdTargetSpeed: 1,
            startingPosition: null,
            times: {},
            charge: { isCharged: false, isCharging: false, startedAt: null, duration: 0 },
            cooldown: { hasCooledDown: true, isCoolingDown: false, startedAt: null, duration: 0 },
        },
        [ENGINE_TYPES.WARP_DRIVE]: {},
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

    store.on('navigation:engineTabChange', ({ navigation }, { type }) => {
        // Need to check why tab wont change on exiting from hyperspace
        return {
            navigation: {
                ...navigation,
                selectedEngineType: type
            }
        };
    });

    store.on('commit:burn', (_, { timeout, throttle }) => {
        store.dispatch('lock:navigation');
        store.dispatch(ACTIONS.EFFECTS.SHAKE, { duration: timeout });
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
        store.dispatch(ACTIONS.EFFECTS.SHAKE, { duration: timeout });
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

    store.on('navigation:storeSetting', ({ navigation }, { type, settings }) => {
        if (!Object.values(ENGINE_TYPES).includes(type)) return;

        return {
            navigation: {
                ...navigation,
                settings: {
                    ...navigation.settings,
                    [type]: {
                        ...navigation.settings[type],
                        ...settings
                    }
                }
            }
        };
    });

    store.on('navigation:chargeHyperdrive', ({ navigation }) => {
        // need to wire the CHARGE TIME
        const hdSettings = navigation.settings[ENGINE_TYPES.HYPER_DRIVE];
        const chargeTimeout = calculateChargeTimeHD(0, hdSettings.hdTargetSpeed) * 1000;
        setTimeout(() => {
            store.dispatch('nagivation:hyperdriveCharged');
        }, chargeTimeout);
        return {
            navigation: {
                ...navigation,
                settings: {
                    ...navigation.settings,
                    [ENGINE_TYPES.HYPER_DRIVE]: {
                        ...hdSettings,
                        charge: { isCharged: false, isCharging: true, startedAt: Time.now(), duration: chargeTimeout }
                    }
                }
            }
        };
    });

    store.on('nagivation:hyperdriveCharged', ({ navigation }) => {
        const hdSettings = navigation.settings[ENGINE_TYPES.HYPER_DRIVE];
        return {
            navigation: {
                ...navigation,
                settings: {
                    ...navigation.settings,
                    [ENGINE_TYPES.HYPER_DRIVE]: {
                        ...hdSettings,
                        charge: { isCharged: true, isCharging: false, startedAt: null, duration: 0 }
                    }
                }
            }
        };
    });

    store.on('navigation:engageHyperdrive', ({ navigation }, { startingPosition, targetPos }) => {
        store.dispatch('navigation:hyperdriveAction', { action: HYPERDRIVE_ACTIONS.ENGAGED, payload: {} });
        store.dispatch('player:toggleHyperdrive', { inHyperdrive: true });
        // here we need to report that it is engaged
        // and lock navigation so we cannot turn/burn
        const hdSettings = navigation.settings[ENGINE_TYPES.HYPER_DRIVE];

        // I need to trigger here a timed event that will move the space through hyperspace
        // update the position on the map also


        // Calculating timeout
        const speed = hdSettings.hdTargetSpeed;
        const distance = Geom.distancePoints(startingPosition, targetPos);
        const jumpDuration = distance / speed;

        //TODO:
        const fuel = calculateFuelCostHD(distance, speed);
        console.log('HD Engaged', { startingPosition, speed, jumpDuration, fuel });
        store.dispatch('player:burnFuel', { fuel });
        let intervals = 0;
        const travelStep = setInterval(() => {
            const { x, y } = Geom.pointOnLine(startingPosition, targetPos, intervals++ / jumpDuration);
            store.dispatch('player:updateSystemPosition', { x, y });
        }, 1000);

        setTimeout(() => {
            clearInterval(travelStep);
            store.dispatch('navigation:exitHyperdrive', { speed, distance });
        }, jumpDuration * 1000);


        return {
            navigation: {
                ...navigation,
                navigationLock: true,
                //
                speed: hdSettings.hdTargetSpeed * C,
                settings: {
                    ...navigation.settings,
                    [ENGINE_TYPES.HYPER_DRIVE]: {
                        ...hdSettings,
                        startingPosition,
                        times: {
                            engagedAt: Time.now(),
                            duration: jumpDuration * 1000
                        }
                    }
                }
            }
        };
    });

    store.on('navigation:exitHyperdrive', ({ navigation }, { speed, distance }) => {
        // little shake on back
        store.dispatch(ACTIONS.EFFECTS.SHAKE, { duration: 1500 });

        store.dispatch('player:exitHyperdrive');

        // starting cooldown
        const cooldownTimeout = calculateCooldownTimeHD(distance, speed) * 1000;
        setTimeout(() => store.dispatch('navigation:cooldownFinished'), cooldownTimeout);

        return {
            navigation: {
                ...navigation,
                navigationLock: false,
                speed: 0,
                settings: {
                    ...navigation.settings,
                    [ENGINE_TYPES.HYPER_DRIVE]: {
                        hdTargetSpeed: 1,
                        startingPosition: null,
                        charge: { isCharged: false, isCharging: false },
                        cooldown: {
                            hasCooledDown: false, isCoolingDown: true,
                            startedAt: Time.now(), duration: cooldownTimeout
                        },
                        times: {}
                    }
                }
            }
        };
    });

    store.on('navigation:cooldownFinished', ({ navigation }) => {
        const hdSettings = navigation.settings[ENGINE_TYPES.HYPER_DRIVE];
        return {
            navigation: {
                ...navigation,
                navigationLock: false,
                speed: 0,
                settings: {
                    ...navigation.settings,
                    [ENGINE_TYPES.HYPER_DRIVE]: {
                        ...hdSettings,
                        cooldown: {
                            hasCooledDown: true, isCoolingDown: false,
                            startedAt: null, duration: 0
                        },
                    }
                }
            }
        };

    });
    store.on('navigation:hyperdriveAction', (_, { action, payload }) => {
        eBridge.emit(EVENTS.GAME.ACTIONS.HYPERDRIVE, { action, payload });
    });
};

export default navigation;