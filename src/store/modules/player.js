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
        isPlotted: false
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
        return {
            player: {
                ...player,
                target
            }
        };
    });

    store.on('player:plotSuccessSystem', ({ player }, { target }) => {
        return {
            player: {
                ...player,
                target,
                route: {
                    type: 'system',
                    isPlotted: true
                }
            }
        };
    });

    store.on('player:clearTargetSystem', ({ player }) => {
        return {
            player: {
                ...player,
                target: null,
                route: {
                    type: 'system',
                    isPlotted: false
                }
            }
        };
    });


};

export default player;