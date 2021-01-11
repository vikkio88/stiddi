import { useEffect } from "react";
import { Zoom } from "./system";
import { Button } from "components/common";

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
            <h3 className="mt-10">Objects</h3>
            <div className="w-full flex f-col f-ac f-jc">
                <Button
                    className="f-1"
                    onClick={() => dispatch('maps:focusSystem', { object: 'player' })}
                >
                    {`SHIP`}
                </Button>
                {system.stars.map((s, i) => (
                    <Button
                        key={`star_${i}`} className="f-1"
                        onClick={() => dispatch('maps:focusSystem', { object: 'stars', index: i })}
                    >
                        {`Star ${i}`}
                    </Button>
                ))}
                {system.planets.map((p, i) => (
                    <Button
                        key={`planet_${i}`} className="f-1"
                        onClick={() => dispatch('maps:focusSystem', { object: 'planets', index: i })}
                    >
                        {`Planet ${i}`}
                    </Button>
                ))}
            </div>

        </>
    );
};


export default SystemMap;