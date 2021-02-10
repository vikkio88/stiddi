import { Time } from "libs/time";
import { Geom } from "libs/math";
import { Countdown, Slider } from "components/common";
import { ENGINE_TYPES } from "enums/navigation";

import ETA from "./ETA";
import EngageControls from "./EngageControls";

import "./styles/Hyperdrive.css";
import { calculateChargeTimeHD, calculateCooldownTimeHD, calculateFuelCostHD } from "libs/game/navigation";

const type = ENGINE_TYPES.HYPER_DRIVE;

const Hyperdrive = ({ lock, settings, position, dispatch, route }) => {
    const { set, direction, speed, inHyperdrive } = settings;
    // exiting hyperdrive
    if (!route) return <h1>Hyperdrive Disengaged</h1>;

    const { hdTargetSpeed, charge, cooldown, times } = settings[type];
    const setTargetSpeed = hdTargetSpeed => set({ hdTargetSpeed }, type);
    const { target } = route;
    const targetPos = target.position;
    // this also has orbiting:bool
    const playerPos = position.system;
    const distance = Geom.distancePoints(playerPos, targetPos);

    return (
        <div className="w-full flex f-row f-ac f-jsb">
            <div
                // this needs to be moved to its own component
                className="HyperDrive-speed f-1 flex f-col f-ac f-jc"
            >
                {inHyperdrive && (
                    <h1>
                        <Countdown start={times.engagedAt} duration={times.duration / 1000} />
                    </h1>
                )}
                {!inHyperdrive && (
                    <>
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
                        <div className="Calculations Calculations-HD">
                            <div>
                                <span className="label">Travel Time: </span>
                                <h3>
                                    <span className="value">
                                        {Time.intervalDurationSecs(distance / hdTargetSpeed)}
                                    </span>
                                </h3>
                            </div>
                            <div>
                                <span className="label">Fuel: </span>
                                <h3>
                                    <span className="value">
                                        ~{(calculateFuelCostHD(distance, hdTargetSpeed, true)).toFixed(2)}
                                    </span> units
                                </h3>
                            </div>
                            <div>
                                <span className="label">Charge Time: </span>
                                <h3>
                                    <span className="value">
                                        ~{(calculateChargeTimeHD(distance, hdTargetSpeed, true)).toFixed(2)}
                                    </span> seconds
                                </h3>
                            </div>
                            <div>
                                <span className="label">Cooldown Time: </span>
                                <h3>
                                    <span className="value">
                                        ~{(calculateCooldownTimeHD(distance, hdTargetSpeed, true)).toFixed(2)}
                                    </span> seconds
                                </h3>
                            </div>
                        </div>

                    </>
                )}
            </div>
            <div className="f-1">
                <ETA distance={distance} speed={speed} inHyperdrive={inHyperdrive} />
                <EngageControls
                    status={{ speed, direction, target }}
                    isLocked={lock}
                    inHyperdrive={inHyperdrive}
                    charge={charge}
                    cooldown={cooldown}
                    onCharge={() => dispatch('navigation:chargeHyperdrive')}
                    onEngage={() => dispatch(
                        'navigation:engageHyperdrive',
                        { startingPosition: playerPos, targetPos }
                    )}
                />
            </div>
        </div>
    );
};

export default Hyperdrive;