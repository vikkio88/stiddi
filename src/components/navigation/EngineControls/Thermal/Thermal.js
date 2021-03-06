import {
    Button, RoundIndicator,
    Slider, Spinner, Row, Col
} from "components/common";
import ACTIONS from "store/actions";
import { ENGINE_TYPES } from "enums/navigation";
import { calculateFuelCost } from "libs/game/navigation";
import Calculations from "./Calculations";
import BurnPreset from "./BurnPreset";

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
        dispatch(ACTIONS.NAV.COMMIT.BURN, { timeout: time, throttle });
    };
    const onFullStop = () => dispatch(ACTIONS.NAV.COMMIT.FULL_STOP);

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
                    <BurnPreset set={set} burnTime={burnTime} throttle={throttle} />
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