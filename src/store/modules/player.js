import { Geom } from "libs/math";
import { ENGINE_TYPES, HYPERDRIVE_ACTIONS } from "enums/navigation";

const initialState = {
    inHyperdrive: false,
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

    store.on('player:toggleHyperdrive', ({ player }, { inHyperdrive }) => {
        return {
            player: {
                ...player,
                inHyperdrive
            }
        };
    });

    store.on('player:exitHyperdrive', ({ player }) => {
        const { x, y } = player.target.position;
        const playerSystemPos = player.position.system;
        // this piece of dirty shit is because the hook rerenders the 
        // hyperdrive after exiting and is empty, so I switch to thermal/clearup
        // after a bit
        store.dispatch('maps:clearPlotSystem');
        store.dispatch('maps:updatePlayerPosSystem', { x, y });
        store.dispatch('navigation:hyperdriveAction', { action: HYPERDRIVE_ACTIONS.EXITED });
        setTimeout(() => {
            store.dispatch('navigation:engineTabChange', { type: ENGINE_TYPES.THERMAL });
        }, 1000);

        // Need to add the setting position on maps so we can see the player there if exiting from 
        // hyperdrive while on the Maps 
        return {
            player: {
                ...player,
                inHyperdrive: false,
                position: {
                    system: {
                        ...playerSystemPos,
                        x, y
                    }
                },
                route: {
                    ...initialState.route,
                }
            }
        };
    });

    // this can be used to show the player moving through hyperspace
    store.on('player:updateSystemPosition', ({ player }, payload) => {
        store.dispatch('maps:updatePlayerPosSystem', payload);
        return {
            player: {
                ...player,
                position: {
                    ...player.position,
                    system: {
                        ...player.position.system,
                        ...payload
                    }
                }
            }
        };
    });

};

export default player;