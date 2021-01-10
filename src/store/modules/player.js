const initialState = {
    fuel: {
        max: 80,
        current: 80
    },
    position: {
        system: {
            x: 50,
            y: 0
        },
        galaxy: {
            x: 0,
            y: 0
        }
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


};

export default player;