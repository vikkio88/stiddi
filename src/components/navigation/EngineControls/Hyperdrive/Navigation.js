import { Time } from "libs/time";
import { calculateChargeTimeHD, calculateCooldownTimeHD, calculateFuelCostHD } from "libs/game/navigation";
import { Countdown, Slider } from "components/common";

import "./styles/Navigation.css";

const Navigation = ({
    inHyperdrive, times,
    hdTargetSpeed, setTargetSpeed, distance, charge
}) => {
    const isDisabled = charge.isCharging || charge.isCharged;
    return (
        <div className="HyperDrive-navigation f-1 flex f-col f-ac f-jc">
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
                        disabled={isDisabled}
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
    );
};

export default Navigation;