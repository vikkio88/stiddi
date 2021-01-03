const initialState = {
    fuel: {
        max: 80,
        current: 80
    },
    position: {
        galaxy: {
            i: 0,
            j: 0
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
        console.log(`burning from ${player.fuel.current}, burning ${fuel}`);
        const current = Math.max((player.fuel.current - fuel), 0);
        console.log(`result burn ${current}`);
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