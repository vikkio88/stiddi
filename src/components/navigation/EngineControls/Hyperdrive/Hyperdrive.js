import { useState } from "react";
import { Geom } from "libs/math";
import { Slider } from "components/common";

import ETA from "./ETA";
import EngageControls from "./EngageControls";

import "./styles/Hyperdrive.css";

const Hyperdrive = ({ lock, settings, position, dispatch, route }) => {
    const [hdSpeed, setHDSpeed] = useState(1);
    const { direction, speed } = settings;
    const { target } = route;
    const targetPos = target.position;
    // this also has orbiting:bool
    const playerPos = position.system;
    const distance = Geom.distancePoints(playerPos, targetPos);

    return (
        <div className="w-full flex f-row f-ac f-jsb">
            <div className="HyperDrive-speed f-1 flex f-col f-ac f-jc">
                <h2>Target Speed</h2>
                <h1>
                    <span className="speed">{hdSpeed}</span> c
                </h1>
                <Slider
                    onChange={e => setHDSpeed(e.target.value)}
                    value={hdSpeed}
                    min={1}
                    step={1}
                    max={200}
                    className="w-full"
                />
                <div className="Calculations">
                    <span className="label">Travel Time: </span>
                    <h3>
                        <span className="value">
                            ~{(distance / hdSpeed).toFixed(2)}
                        </span> s
                    </h3>
                </div>
                <div className="Calculations">
                    <span className="label">Fuel: </span>
                    <h3>
                        <span className="value">
                            ~{(hdSpeed / 10).toFixed(2)}
                        </span> units
                    </h3>
                </div>

            </div>
            <div className="f-1">
                <ETA distance={distance} speed={speed} />
                <EngageControls
                    status={{ speed, direction, target }}
                    isLocked={lock}
                    onEngage={() => dispatch('navigation:engageHyperdrive', { targetSpeed: hdSpeed })}
                />
            </div>
        </div>
    );
};

export default Hyperdrive;