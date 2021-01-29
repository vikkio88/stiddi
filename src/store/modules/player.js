import { Geom } from "libs/math";
import { ENGINE_TYPES, HYPERDRIVE_ACTIONS } from "enums/navigation";

const initialState = {
    fuel: {
        max: 80,
        current: 80
    },
    position: {
        system: {
            x: 95,
            y: 0,
            orbiting: false,
        },
        galaxy: {
            x: 0,
            y: 0
        }
    },
    target: null,
    route: {
        type: 'system',
        isPlotted: false,
        isLocked: false
    }
};

const player = store => {
    store.on('@init', () => {
        return {
            player: {
                ...initialState
            }
        };
    });

    store.on('player:burnFuel', ({ player }, { fuel }) => {
        const current = Math.max((player.fuel.current - fuel), 0);
        console.log(`burned ${current} units`);
        return {
            player: {
                ...player,
                fuel: {
                    ...player.fuel,
                    current
                }
            }
        };
    });

    store.on('player:loadFuel', ({ player }, { fuel }) => {
        const current = Math.min((player.fuel.current + fuel), player.fuel.max);
        return {
            player: {
                ...player,
                fuel: {
                    ...player.fuel,
                    current
                }
            }
        };
    });

    // make sure x,y are relative to 0,0 center of the system
    store.on('player:targetSystem', ({ player }, { target }) => {
        // we need avoiding replacing the route if is locked
        return {
            player: {
                ...player,
                target
            }
        };
    });

    store.on('player:plotSuccessSystem', ({ player }, { target }) => {
        console.log('PLOT SUCCESS', target);
        const playerPos = player.position.system;
        const targetPos = target.position;
        const angle = Geom.angleBetween(playerPos, targetPos);

        return {
            player: {
                ...player,
                target: {
                    ...target,
                    angle
                },
                route: {
                    ...player.route,
                    type: 'system',
                    isPlotted: true
                }
            }
        };
    });

    store.on('player:clearRouteSystem', ({ player }) => {
        store.dispatch('maps:clearPlotSystem');
        store.dispatch('navigation:engineTabChange', { type: ENGINE_TYPES.THERMAL });
        store.dispatch('navigation:hyperdriveAction', { action: HYPERDRIVE_ACTIONS.UNLOCKED });
        return {
            player: {
                ...player,
                route: {
                    ...initialState.route,
                }
            }
        };
    });

    store.on('player:lockRouteSystem', ({ player }) => {
        // show in the Radar the direction of the locked plot
        store.dispatch('navigation:hyperdriveAction', { action: HYPERDRIVE_ACTIONS.LOCKED, payload: { angle: player.target.angle } });
        //

        return {
            player: {
                ...player,
                route: {
                    ...player.route,
                    isLocked: true
                }
            }
        };
    });


};

export default player;