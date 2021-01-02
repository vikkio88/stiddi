import { useState } from "react";
import { Button, RoundIndicator, Slider } from "components/common";
import Calculations from "./Calculations";

import "./styles/Engine.css";


const Engine = ({ onBurn, onFullStop, speed = 0, lock = false }) => {
    const [burnTime, setBurnTime] = useState(1);
    const [throttle, setThrottle] = useState(25);

    const canBurn = !lock && (burnTime > 0 && throttle > 0);
    const canFullStop = !lock && speed > 0 && speed < 3;
    return (
        <div className="NavigationTab-engine ui-section-t">
            <div className="w-full flex f-col">
                <div className="w-full flex f-row f-ac f-jsb pr-5 pl-5">
                    <h4>Burn Time</h4>
                    <RoundIndicator value={burnTime} max={10} showRail>
                        sec
                    </RoundIndicator>
                </div>
                <Slider
                    onChange={e => setBurnTime(e.target.value)}
                    value={burnTime}
                    min={0}
                    className="w-full"
                />
            </div>
            <div className="w-full flex f-col">
                <div className="w-full flex f-row f-ac f-jsb pr-5 pl-5">
                    <h3>Throttle</h3>
                    <RoundIndicator value={throttle} max={100} showRail>
                        %
                    </RoundIndicator>
                </div>
                <Slider
                    onChange={e => setThrottle(e.target.value)}
                    value={throttle}
                    min={0}
                    step={25}
                    max={100}
                    className="w-full"
                />
            </div>
            <div className="w-full flex f-row f-ac f-jsa mt-20">
                <div className="f-1 flex f-col f-ac f-jc">
                    <Calculations
                        burnTime={burnTime}
                        throttle={throttle / 100}
                    />
                </div>
                <div className="f-1 flex f-col f-ae f-jc">
                    <Button
                        onClick={() => onBurn(burnTime, throttle)}
                        variant={Button.Variants.EMPTY_GREEN}
                        className="mr-5"
                        style={{ width: "150px", height: "100px" }}
                        disabled={!canBurn}
                    >
                        BURN
                    </Button>
                    <Button
                        onClick={onFullStop}
                        variant={Button.Variants.RED}
                        className="mr-5"
                        disabled={!canFullStop}
                    >
                        Full Stop
                    </Button>
                </div>
            </div>
        </div>
    );
};


export default Engine;