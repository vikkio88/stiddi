import { useEffect } from "react";
import { Zoom, Bodies } from "./system";

const SystemMap = ({ dispatch, system }) => {
    useEffect(() => {
        console.log(system);
        return () => dispatch('maps:clearSystem');
    });

    return (
        <>
            <h2>System Map</h2>
            <h1>{`${system.name}`}</h1>
            <Zoom onZoom={config => dispatch('maps:zoomSystem', config)} />
            <Bodies
                system={system}
                // those two might be moved down as I have dispatch
                onFocus={config => dispatch('maps:focusSystem', config)}
                onPlot={config => dispatch('maps:plotSystem', config)}
            />
        </>
    );
};


export default SystemMap;