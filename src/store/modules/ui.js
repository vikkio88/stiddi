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
};

export default ui;