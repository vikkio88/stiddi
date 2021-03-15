import eBridge, { EVENTS } from 'libs/eventBridge';
import { TABS, SCENES_MAP } from "enums/ui";

const initialState = {
    tab: TABS.NAVIGATION
};

const ui = store => {
    store.on('@init', () => {
        return {
            ui: {
                ...initialState
            }
        };
    });

    store.on('ui:tabChange', ({ ui }, { tab }) => {

        (tab === TABS.MAPS) ?
            store.dispatch('effects:squarePorthole')
            : store.dispatch('effects:roundPorthole');

        if (SCENES_MAP[tab]) {
            eBridge.emit(EVENTS.PHASER.SWAP_SCENE, { scene: SCENES_MAP[tab] });
        }

        return {
            ui: {
                ...ui,
                tab
            }
        };
    });


    // Might not be needed
    store.on('ui:swapScene', (_, { scene }) => {
        eBridge.emit(EVENTS.PHASER.SWAP_SCENE, { scene });
    });
};

export default ui;