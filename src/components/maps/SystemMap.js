import { MAPS } from "enums/ui";
import ACTIONS from "store/actions";
import { useEffect } from "react";
import { Zoom, Bodies } from "./system";

const SystemMap = ({ dispatch, system }) => {
    useEffect(() => {
        dispatch(ACTIONS.MAPS.SYSTEM.DRAW);
        dispatch(ACTIONS.UI.SWAP_SCENE, { scene: MAPS.SYSTEM_MAP });
        return () => dispatch(ACTIONS.MAPS.SYSTEM.CLEAR);
    });

    return (
        <>
            <h2>System Map</h2>
            <h1>{`${system.name}`}</h1>
            <Zoom onZoom={config => dispatch(ACTIONS.MAPS.SYSTEM.ZOOM, config)} />
            <Bodies
                system={system}
                // those two might be moved down as I have dispatch
                onFocus={config => dispatch(ACTIONS.MAPS.SYSTEM.FOCUS, config)}
                onPlot={config => dispatch(ACTIONS.MAPS.SYSTEM.PLOT, config)}
            />
        </>
    );
};


export default SystemMap;