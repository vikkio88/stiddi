import ACTIONS from "store/actions";
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

    store.on(ACTIONS.UI.TAB_CHANGE, ({ ui }, { tab }) => {

        (tab === TABS.MAPS) ?
            store.dispatch(ACTIONS.EFFECTS.SQUARE_PORTHOLE)
            : store.dispatch(ACTIONS.EFFECTS.ROUND_PORTHOLE);

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

    store.on(ACTIONS.UI.SWAP_SCENE, (_, { scene }) => {
        eBridge.emit(EVENTS.PHASER.SWAP_SCENE, { scene });
    });
};

export default ui;