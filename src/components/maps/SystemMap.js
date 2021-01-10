import { useEffect } from "react";
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
            <h3>Zoom</h3>
            <div className="w-full flex f-col f-ac f-jc">
                <div className="w-full flex f-row f-ac f-jc">

                    <Button
                        className="f-1"
                        onClick={() => dispatch('maps:zoomSystem')}
                    >
                        -
                </Button>
                    <Button
                        className="f-1"
                        onClick={() => dispatch('maps:zoomSystem', { out: false })}
                    >
                        +
                </Button>
                </div>
                <div className="w-full flex f-row f-ac f-jc">
                    <Button
                        className="f-1"
                        onClick={() => dispatch('maps:zoomSystem', { level: 4 })}
                    >
                        x4
                    </Button>
                    <Button
                        className="f-1"
                        onClick={() => dispatch('maps:zoomSystem', { level: 3 })}
                    >
                        x3
                    </Button>
                    <Button
                        className="f-1"
                        onClick={() => dispatch('maps:zoomSystem', { level: .9 })}
                    >
                        x2
                    </Button>
                    <Button
                        className="f-1"
                        onClick={() => dispatch('maps:zoomSystem', { level: .3 })}
                    >
                        x1
                    </Button>
                </div>
                <div className="w-full flex f-row f-ac f-jc">
                    <Button
                        className="f-1"
                        onClick={() => dispatch('maps:zoomSystem', { reset: true })}
                    >
                        Reset
                    </Button>
                </div>
            </div>

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