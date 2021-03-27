import { useEffect } from "react";
import { useStoreon } from "storeon/react";
import ACTIONS from "store/actions";
import { MAPS } from "enums/ui";

const SectorMap = ({ dispatch }) => {
    useEffect(() => {
        dispatch(ACTIONS.UI.SWAP_SCENE, { scene: MAPS.SECTOR_MAP });
        dispatch(ACTIONS.MAPS.SECTOR.UPDATE);
        // no need to clear system, maybe the sector
        return () => {/*dispatch(ACTIONS.MAPS.SYSTEM.CLEAR);*/ };
    });
    const { sector: { selected } } = useStoreon('sector');

    return (
        <>
            <h2>Sector Map Controls</h2>
            {selected && (<h1>Sector {selected.il} , {selected.jl} </h1>)}
        </>
    );
};


export default SectorMap;