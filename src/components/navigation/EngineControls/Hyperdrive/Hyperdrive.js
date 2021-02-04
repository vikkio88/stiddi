import { Geom } from "libs/math";
import { Slider } from "components/common";
import { ENGINE_TYPES } from "enums/navigation";

import ETA from "./ETA";
import EngageControls from "./EngageControls";

import "./styles/Hyperdrive.css";

const type = ENGINE_TYPES.HYPER_DRIVE;

const Hyperdrive = ({ lock, settings, position, dispatch, route }) => {
    const { set, direction, speed, inHyperdrive } = settings;
    // exiting hyperdrive
    if (!route) return null;

    const { hdTargetSpeed } = settings[type];
    const setTargetSpeed = hdTargetSpeed => set({ hdTargetSpeed }, type);
    const { target } = route;
    const targetPos = target.position;
    // this also has orbiting:bool
    const playerPos = position.system;
    const distance = Geom.distancePoints(playerPos, targetPos);

    return (
        <div className="w-full flex f-row f-ac f-jsb">
            { !inHyperdrive && (
                <div
                    // this needs to be moved to its own component
                    className="HyperDrive-speed f-1 flex f-col f-ac f-jc"
                >
                    <h2>Target Speed</h2>
                    <h1>
                        <span className="speed">{hdTargetSpeed}</span> c
                </h1>
                    <Slider
                        onChange={e => setTargetSpeed(e.target.value)}
                        value={hdTargetSpeed}
                        min={1}
                        step={1}
                        max={200}
                        className="w-full"
                    />
                    <div className="Calculations">
                        <span className="label">Travel Time: </span>
                        <h3>
                            <span className="value">
                                ~{(distance / hdTargetSpeed).toFixed(2)}
                            </span> s
                    </h3>
                    </div>
                    <div className="Calculations">
                        <span className="label">Fuel: </span>
                        <h3>
                            <span className="value">
                                ~{(hdTargetSpeed / 10).toFixed(2)}
                            </span> units
                    </h3>
                    </div>

                </div>
            )}
            <div className="f-1">
                <ETA distance={distance} speed={speed} inHyperdrive={inHyperdrive} />
                <EngageControls
                    status={{ speed, direction, target }}
                    isLocked={lock}
                    inHyperdrive={inHyperdrive}
                    onEngage={() => dispatch(
                        'navigation:engageHyperdrive',
                        { startingPosition: playerPos }
                    )}
                />
            </div>
        </div>
    );
};

export default Hyperdrive;