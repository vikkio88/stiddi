import { useEffect } from "react";
import { Zoom, Bodies } from "./system";

const SystemMap = ({ dispatch, system }) => {
    useEffect(() => {
        console.log(system);
        return () => dispatch('maps:clearSystem');
    });
    return (
        <>
            <h2>
                SystemMap
            </h2>
            <Zoom onZoom={config => dispatch('maps:zoomSystem', config)} />
            <Bodies system={system} onFocus={config => dispatch('maps:focusSystem', config)} />
        </>
    );
};


export default SystemMap;