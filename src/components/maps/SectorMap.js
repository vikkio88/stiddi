import { useEffect } from "react";
import ACTIONS from "store/actions";
import { MAPS } from "enums/ui";

const SectorMap = ({ dispatch }) => {
    useEffect(() => {
        dispatch(ACTIONS.UI.SWAP_SCENE, { scene: MAPS.SECTOR_MAP });
        // no need to clear system, maybe the sector
        return () => dispatch('maps:clearSystem');
    });

    return <h2>Sector Map Controls</h2>;
};


export default SectorMap;