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
    }



};

export default ACTIONS;