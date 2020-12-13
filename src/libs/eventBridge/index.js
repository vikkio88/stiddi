export const EVENTS = {
    GAME: {
        ACTIONS: {
            BURN: 'game:action:burn',
            ROTATE: 'game:action:rotate',
            FULL_STOP: 'game:action:fullstop',
        }
    },

    PHASER: {
        READY: 'phaser:ready',
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
    emitFromPhaser(type, payload = null) {
        this.emit(EVENTS.PHASER.EVENT, { type, payload });
    },
};

export default eventBridge;