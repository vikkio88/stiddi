import { useEffect } from "react";
import { useStoreon } from "storeon/react";
import { SystemMap } from "components/maps";

const Maps = () => {
    const { dispatch, maps: { system } } = useStoreon('maps');
    useEffect(() => {
        dispatch('maps:drawSystem');
    });
    return (
        <>
            <h1>
                Maps
            </h1>

            <SystemMap dispatch={dispatch} system={system} />
        </>
    );
};

export default Maps;