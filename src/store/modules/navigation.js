import ACTIONS from "store/actions";
import { ENGINE_TYPES, HYPERDRIVE_ACTIONS } from "enums/navigation";
import eBridge, { EVENTS } from "libs/eventBridge";
import {
    calculateChargeTimeHD, calculateCooldownTimeHD,
    calculateFuelCost, calculateFuelCostHD, calculateFullStopTimeout
} from "libs/game/navigation";
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
    store.on(ACTIONS.NAV.HB, ({ navigation }, payload) => {
        return {
            navigation: {
                ...navigation,
                ...payload
            }
        };
    });

    store.on(ACTIONS.NAV.ENGINE.TAB_CHANGE, ({ navigation }, { type }) => {
        // Need to check why tab wont change on exiting from hyperspace
        return {
            navigation: {
                ...navigation,
                selectedEngineType: type
            }
        };
    });

    store.on(ACTIONS.NAV.COMMIT.BURN, (_, { timeout, throttle }) => {
        store.dispatch(ACTIONS.NAV.LOCK.NAV);
        store.dispatch(ACTIONS.EFFECTS.SHAKE, { duration: timeout });
        const fuel = calculateFuelCost(timeout, throttle);
        store.dispatch(ACTIONS.PLAYER.FUEL.BURN, { fuel });
        eBridge.emit(EVENTS.GAME.ACTIONS.BURN, { timeout, throttle });
    });

    store.on(ACTIONS.NAV.COMMIT.ROTATE, (_, { angle }) => {
        store.dispatch(ACTIONS.NAV.LOCK.NAV);
        eBridge.emit(EVENTS.GAME.ACTIONS.ROTATE, { angle });
    });

    store.on(ACTIONS.NAV.COMMIT.FULL_STOP, ({ navigation }) => {
        store.dispatch(ACTIONS.NAV.LOCK.NAV);
        const { speed } = navigation;
        const timeout = calculateFullStopTimeout(speed);
        const fuel = calculateFuelCost(timeout, .10);
        store.dispatch(ACTIONS.EFFECTS.SHAKE, { duration: timeout });
        store.dispatch(ACTIONS.PLAYER.FUEL.BURN, { fuel });
        setTimeout(() => {
            eBridge.emit(EVENTS.GAME.ACTIONS.FULL_STOP);
            store.dispatch(ACTIONS.NAV.UNLOCK.NAV);
        }, timeout);

    });

    store.on(ACTIONS.NAV.LOCK.NAV, ({ navigation }) => {
        return {
            navigation: {
                ...navigation,
                navigationLock: true
            }
        };
    });

    store.on(ACTIONS.NAV.UNLOCK.NAV, ({ navigation }) => {
        return {
            navigation: {
                ...navigation,
                navigationLock: false
            }
        };
    });

    store.on(ACTIONS.NAV.SETTINGS.STORE, ({ navigation }, { type, settings }) => {
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

    store.on(ACTIONS.NAV.HD.CHARGE, ({ navigation }) => {
        // need to wire the CHARGE TIME
        const hdSettings = navigation.settings[ENGINE_TYPES.HYPER_DRIVE];
        const chargeTimeout = calculateChargeTimeHD(0, hdSettings.hdTargetSpeed) * 1000;
        setTimeout(() => {
            store.dispatch(ACTIONS.NAV.HD.CHARGED);
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

    store.on(ACTIONS.NAV.HD.CHARGED, ({ navigation }) => {
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

    store.on(ACTIONS.NAV.HD.ENGAGE, ({ navigation }, { startingPosition, targetPos }) => {
        store.dispatch(ACTIONS.NAV.HD.ACTION, { action: HYPERDRIVE_ACTIONS.ENGAGED, payload: {} });
        store.dispatch(ACTIONS.PLAYER.HD.TOGGLE, { inHyperdrive: true });
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
        store.dispatch(ACTIONS.PLAYER.FUEL.BURN, { fuel });
        let intervals = 0;
        const travelStep = setInterval(() => {
            const { x, y } = Geom.pointOnLine(startingPosition, targetPos, intervals++ / jumpDuration);
            store.dispatch(ACTIONS.PLAYER.SYSTEM.POS_UPDATE, { x, y });
        }, 1000);

        setTimeout(() => {
            clearInterval(travelStep);
            store.dispatch(ACTIONS.NAV.HD.EXIT, { speed, distance });
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

    store.on(ACTIONS.NAV.HD.EXIT, ({ navigation }, { speed, distance }) => {
        // little shake on back
        store.dispatch(ACTIONS.EFFECTS.SHAKE, { duration: 1500 });
        store.dispatch(ACTIONS.PLAYER.HD.EXIT);
        // Here we generate the sector
        store.dispatch(ACTIONS.MAPS.SECTOR.GENERATE, {});

        // starting cooldown
        const cooldownTimeout = calculateCooldownTimeHD(distance, speed) * 1000;
        setTimeout(() => store.dispatch(ACTIONS.NAV.HD.COOLDOWN_FINISHED), cooldownTimeout);

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

    store.on(ACTIONS.NAV.HD.COOLDOWN_FINISHED, ({ navigation }) => {
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
    store.on(ACTIONS.NAV.HD.ACTION, (_, { action, payload }) => {
        eBridge.emit(EVENTS.GAME.ACTIONS.HYPERDRIVE, { action, payload });
    });
};

export default navigation;