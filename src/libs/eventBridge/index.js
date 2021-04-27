export const EVENTS = {
    GAME: {
        ACTIONS: {
            BURN: 'game:action:burn',
            ROTATE: 'game:action:rotate',
            FULL_STOP: 'game:action:fullstop',
            HYPERDRIVE: 'game:action:hyperdrive'
        },
        EFFECTS: {
            SHAKE: 'game:effects:shake'
        },
        MAPS: {
            DRAW_SYSTEM: 'game:maps:draw_system',
            ZOOM_SYSTEM: 'game:maps:zoom_system',
            FOCUS_SYSTEM: 'game:maps:focus_system',
            PLOTROUTE_SYSTEM: 'game:maps:plot_route_system',
            CLEAR_PLOTROUTE_SYSTEM: 'game:maps:clear_plot_route_system',
            CLEAR_SYSTEM: 'game:maps:clear_system',
            // this ↓ need to be moved to SYSTEM
            UPDATE_PLAYER: 'game:maps:update_player',
            SECTOR: {
                SET: 'game:maps:sector:set',
                UPDATE_PLAYER: 'game:maps:sector:update_player',
            }
        }
    },

    PHASER: {
        READY: 'phaser:ready',
        SET_SCENE: 'phaser:set_scene',
        SWAP_SCENE: 'phaser:swap_scene',
        HEARTBEAT: 'phaser:heartbeat',
        EVENT: 'phaser:event'
    }
};

const eventBridge = {
    emit(event, payload) {
        if (!window.eBridge) return false;

        window.eBridge.emit(event, payload);
        return true;
    },
    on(event, callback) {
        if (!window.eBridge) return false;

        window.eBridge.on(event, callback);
        return true;
    },
    dispatchFromPhaser(type, payload = null) {
        this.emit(EVENTS.PHASER.EVENT, { type, payload });
    },
};

export default eventBridge;