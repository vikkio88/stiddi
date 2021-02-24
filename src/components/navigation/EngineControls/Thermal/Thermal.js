import { Button, RoundIndicator, Slider, Spinner } from "components/common";
import Calculations from "./Calculations";
import { ENGINE_TYPES } from "enums/navigation";
import { calculateFuelCost } from "libs/game/navigation";

const Col = ({ full = true, style = {}, className = '', children }) => (
    <div
        className={`flex ${full ? ' w-full' : 'f1'} f-col ${className}`}
        style={style}
    >
        {children}
    </div>
);

const Row = ({ full = true, style = {}, className = '', children }) => (
    <div
        className={`flex ${full ? ' w-full' : 'f1'} f-row ${className}`}
        style={style}
    >
        {children}
    </div>
);

const Burning = ({ reason = null }) => (
    <div className="flex f-col f-ac f-jc">
        <span>{reason ? reason : 'Locked'}</span>
        <Spinner />
    </div>
);



const Thermal = ({ lock, settings, dispatch }) => {
    const { set, speed, inHyperdrive, fuel } = settings;
    const { burnTime = 1, throttle = 25 } = settings[ENGINE_TYPES.THERMAL];
    const { charge: { isCharging, isCharged } } = settings[ENGINE_TYPES.HYPER_DRIVE];
    const isHyperdriveLocked = inHyperdrive || isCharging || isCharged;
    const setBurnTime = burnTime => set({ burnTime });
    const setThrottle = throttle => set({ throttle });
    const onBurn = (time, throttlePercentage = 25) => {
        time = time * 1000;
        const throttle = throttlePercentage / 100;
        dispatch('commit:burn', { timeout: time, throttle });
    };
    const onFullStop = () => dispatch('commit:fullstop');

    const fuelCost = calculateFuelCost(burnTime, throttle, true);
    const hasEnoughFuel = fuel.current - fuelCost >= 1;
    const lockReason = !hasEnoughFuel ? 'No Fuel' : (isHyperdriveLocked ? 'Hyperdrive Locked' : null);
    const canBurn = hasEnoughFuel && !isHyperdriveLocked && !lock && (burnTime > 0 && throttle > 0);
    const canFullStop = hasEnoughFuel && !isHyperdriveLocked && !lock && speed > 0 && speed < 3;
    return (
        <>
            <Row>
                <Col>
                    <Col>
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
                    </Col>
                    <Col>
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
                    </Col>

                </Col>
                <Col>
                    <Col className="f-ac f-jc mt-10">
                        <h3>Burn Presets</h3>
                        <Row full={false}>
                            <Button
                                disabled={burnTime >= 10 && throttle >= 100}
                                onClick={() => set({ burnTime: 10, throttle: 100 })}
                                style={{ width: "100px", border: "solid 1px black" }}
                            >
                                Full
                            </Button>
                            <Button
                                disabled={burnTime === 5 && throttle === 50}
                                onClick={() => set({ burnTime: 5, throttle: 50 })}
                                style={{ width: "100px", border: "solid 1px black" }}
                            >
                                Half
                            </Button>
                            <Button
                                disabled={burnTime === 1 && throttle === 5}
                                onClick={() => set({ burnTime: 1, throttle: 5 })}
                                style={{ width: "100px", border: "solid 1px black" }}
                            >
                                Min
                            </Button>
                        </Row>
                        <Row full={false}>
                            <Button
                                onClick={() => set({ burnTime: 2, throttle: 100 })}
                                style={{ width: "50px", border: "solid 1px black" }}
                            >
                                10
                            </Button>
                            <Button
                                onClick={() => set({ burnTime: 4, throttle: 100 })}
                                style={{ width: "50px", border: "solid 1px black" }}
                            >
                                20
                            </Button>
                            <Button
                                onClick={() => set({ burnTime: 6, throttle: 100 })}
                                style={{ width: "50px", border: "solid 1px black" }}
                            >
                                30
                            </Button>
                            <Button
                                onClick={() => set({ burnTime: 8, throttle: 100 })}
                                style={{ width: "50px", border: "solid 1px black" }}
                            >
                                40
                            </Button>
                            <Button
                                onClick={() => set({ burnTime: 10, throttle: 100 })}
                                style={{ width: "50px", border: "solid 1px black" }}
                            >
                                50
                            </Button>
                        </Row>
                        <Button
                            onClick={() => {
                                const newBurnTime = Math.max(Math.floor((throttle / 100) * 10), 1);
                                const newThrottle = Math.max(Math.floor((burnTime / 10) * 100), 5);
                                set({
                                    burnTime: newBurnTime,
                                    throttle: newThrottle
                                });
                            }}
                            style={{ width: "150px", border: "solid 1px black" }}
                        >
                            Toggle T/B
                        </Button>
                    </Col>
                </Col>
            </Row>
            <div className="w-full flex f-row f-ac f-jsa mt-20">
                <div className="f-1 flex f-col f-ac f-jc">
                    <Calculations
                        burnTime={burnTime}
                        throttle={throttle / 100}
                        fuelCost={fuelCost}
                    />
                </div>
                <div className="f-1 flex f-col f-ae f-jc">
                    <Button
                        onClick={onFullStop}
                        variant={Button.Variants.RED}
                        className="mr-5"
                        disabled={!canFullStop}
                    >
                        Full Stop
                    </Button>
                    <Button
                        onClick={() => onBurn(burnTime, throttle)}
                        variant={Button.Variants.EMPTY_GREEN}
                        className="mr-5 mt-5 flex f-ac f-jc"
                        style={{ width: "150px", height: "90px" }}
                        disabled={!canBurn}
                    >
                        {canBurn ? `BURN` : <Burning reason={lockReason} />}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Thermal;