import { useEffect } from "react";
import ACTIONS from "store/actions";
import { MAPS } from "enums/ui";

const GalaxyMap = ({ dispatch }) => {
    useEffect(() => {
        dispatch(ACTIONS.UI.SWAP_SCENE, { scene: MAPS.GALAXY_MAP });
        // no need to clear system, maybe the sector
        return () => dispatch('maps:clearSystem');
    });

    return <h2>Galaxy Map Controls</h2>;
};


export default GalaxyMap;