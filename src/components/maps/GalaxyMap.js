import { useEffect } from "react";
import { MAPS } from "enums/ui";

const GalaxyMap = ({ dispatch }) => {
    useEffect(() => {
        dispatch('ui:swapScene', { scene: MAPS.GALAXY_MAP });
        // no need to clear system, maybe the sector
        return () => dispatch('maps:clearSystem');
    });

    return <h2>Galaxy Map Controls</h2>;
};


export default GalaxyMap;