import ACTIONS from "store/actions";
//import eBridge, { EVENTS } from 'libs/eventBridge';


const initialState = {
    selected: null
};

const sector = store => {
    store.on('@init', () => {
        return {
            sector: {
                ...initialState
            }
        };
    });

    store.on(ACTIONS.MAPS.SECTOR.SELECT, ({ sector }, { selected }) => {
        return {
            sector: {
                ...sector,
                selected
            }
        };

    });
};

export default sector;