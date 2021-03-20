const ACTIONS = {
    // Triggering some UI Effects
    EFFECTS: {
        SHAKE: 'effects:shake',
        SQUARE_PORTHOLE: 'effects:squarePorthole',
        ROUND_PORTHOLE: 'effects:roundPorthole',
    },

    // UI actions
    UI: {
        TAB_CHANGE: 'ui:tabChange',
        SWAP_SCENE: 'ui:swapScene'
    },

    // Maps actions
    MAPS: {
        SYSTEM: {
            DRAW: 'maps:drawSystem',
            CLEAR: 'maps:clearSystem',
            ZOOM: 'maps:zoomSystem',
            FOCUS: 'maps:focusSystem',
            PLOT: 'maps:plotSystem',
            CLEAR_PLOT: 'maps:clearPlotSystem',
            UPDATE_PLAYER_POS: 'maps:updatePlayerPosSystem'
        }
    },

    // Navigation actions
    NAV: {
        // this will update player position/speed
        // weird naming? yeah sure
        HB: 'phaser:heartbeat',

        SETTINGS: {
            STORE: 'navigation:storeSetting'
        },

        ENGINE: {
            TAB_CHANGE: 'navigation:engineTabChange'
        },
        COMMIT: {
            BURN: 'commit:burn',
            ROTATE: 'commit:rotate',
            FULL_STOP: 'commit:fullstop',
        },

        LOCK: {
            NAV: 'lock:navigation'
        },
        UNLOCK: {
            NAV: 'unlock:navigation'
        },

        //HyperDrive
        HD: {
            ACTION: 'navigation:hyperdriveAction',
            
            CHARGE: 'navigation:chargeHyperdrive',
            CHARGED: 'navigation:hyperdriveCharged',

            ENGAGE: 'navigation:engageHyperdrive',
            EXIT: 'navigation:exitHyperdrive',

            COOLDOWN_FINISHED: 'navigation:cooldownFinished',

        }


    }



};

export default ACTIONS;