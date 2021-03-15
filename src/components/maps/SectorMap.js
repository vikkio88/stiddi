import { useEffect } from "react";
import { MAPS } from "enums/ui";

const SectorMap = ({ dispatch }) => {
    useEffect(() => {
        dispatch('ui:swapScene', { scene: MAPS.SECTOR_MAP });
        // no need to clear system, maybe the sector
        return () => dispatch('maps:clearSystem');
    });

    return <h2>Sector Map Controls</h2>;
};


export default SectorMap;