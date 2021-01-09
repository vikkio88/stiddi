export const EVENTS = {
    GAME: {
        ACTIONS: {
            BURN: 'game:action:burn',
            ROTATE: 'game:action:rotate',
            FULL_STOP: 'game:action:fullstop',
        },
        EFFECTS: {
            SHAKE: 'game:effects:shake'
        },
        MAPS: {
            DRAW_SYSTEM: 'game:maps:draw_system',
            ZOOM_SYSTEM: 'game:maps:zoom_system',
            FOCUS_SYSTEM: 'game:maps:focus_system',
            CLEAR_SYSTEM: 'game:maps:clear_system',
            UPDATE_SELF: 'game:maps:update_self'
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