import { TABS } from "enums/ui";

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

    store.on('transition', ({ ui }) => {
        return {
            ui: {
                ...ui,
            }
        };
    });
};

export default ui;