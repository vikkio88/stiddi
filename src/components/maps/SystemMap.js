import { useEffect } from "react";
import { Button } from "components/common";

const SystemMap = ({ dispatch }) => {
    useEffect(() => {
        return () => dispatch('maps:clearSystem');
    });
    return (
        <>
            <h2>
                SystemMap
            </h2>
            <Button onClick={() => dispatch('maps:zoomSystem')}>
                -
            </Button>
            <Button onClick={() => dispatch('maps:zoomSystem', { out: false })}>
                +
            </Button>
        </>
    );
};


export default SystemMap;