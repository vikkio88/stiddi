import { Time } from "libs/time";
import { calculateChargeTimeHD, calculateCooldownTimeHD } from "libs/game/navigation";
import { Slider } from "components/common";

import "./styles/Navigation.css";
import { Numbers } from "libs/math";

const Navigation = ({
    hdTargetSpeed, setTargetSpeed, distance, charge, fuelCost
}) => {
    const isDisabled = charge.isCharging || charge.isCharged;
    return (
        <div className="HyperDrive-navigation f-1 flex f-col f-ac f-jc">
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
                            ~{fuelCost ? Numbers.kFormat(fuelCost) : '-'}
                        </span> units
                                </h3>
                </div>
                <div>
                    <span className="label">Charge Time: </span>
                    <h3>
                        <span className="value">
                            ~{Numbers.kFormat(calculateChargeTimeHD(distance, hdTargetSpeed, true))}
                        </span> sec
                                </h3>
                </div>
                <div>
                    <span className="label">Cooldown Time: </span>
                    <h3>
                        <span className="value">
                            ~{Numbers.kFormat(calculateCooldownTimeHD(distance, hdTargetSpeed, true))}
                        </span> sec
                                </h3>
                </div>
            </div>

        </div>
    );
};

export default Navigation;