import { Button, RoundIndicator, Slider, Navbar } from "components/common";
import { ENGINE_TYPES } from "enums/navigation";
import Calculations from "./Calculations";

import "./styles/Engine.css";


const Engine = ({ speed = 0, lock = false, engineType, settings = {}, dispatch }) => {
    const { set } = settings;
    //this might need to be passed down to the single engine type subcomp
    const { burnTime = 1, throttle = 25 } = settings[engineType];
    const setBurnTime = burnTime => set({ burnTime });
    const setThrottle = throttle => set({ throttle });
    const onBurn = (time, throttlePercentage = 25) => {
        time = time * 1000;
        const throttle = throttlePercentage / 100;
        dispatch('commit:burn', { timeout: time, throttle });
    };
    const onFullStop = () => dispatch('commit:fullstop');
    //

    const canBurn = !lock && (burnTime > 0 && throttle > 0);
    const canFullStop = !lock && speed > 0 && speed < 3;
    return (
        <div className="NavigationTab-engine">
            <Navbar
                className="w-full"
                current={engineType}
                tabs={Object.values(ENGINE_TYPES)}
                onChange={type => dispatch('navigation:subtabChange', { type })}
            />
            <div className="w-full flex f-col">
                <div className="w-full flex f-row f-ac f-jsb pr-5 pl-5">
                    <h4>Burn Time</h4>
                    <RoundIndicator value={burnTime} max={10} showRail radius={40}>
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
                    <RoundIndicator value={throttle} max={100} showRail radius={40}>
                        %
                    </RoundIndicator>
                </div>
                <Slider
                    onChange={e => setThrottle(e.target.value)}
                    value={throttle}
                    min={0}
                    step={5}
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