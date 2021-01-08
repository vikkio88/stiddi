import { useEffect } from "react";
import { useStoreon } from "storeon/react";
import { SystemMap } from "components/maps";

const Maps = () => {
    const { dispatch } = useStoreon();
    useEffect(() => {
        dispatch('maps:drawSystem');
    });
    return (
        <>
            <h1>
                Maps
            </h1>

            <SystemMap dispatch={dispatch} />
        </>
    );
};

export default Maps;