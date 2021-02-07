import { Angle, ANGLES } from "libs/math";
import { Button, Progress, Spinner } from "components/common";

// this might be moved to config too?
const ANGLE_SENSITIVITY = 5;

const Charging = () => (
    <div className="flex f-col f-ac f-jc">
        <span>Charging...</span>
        <Spinner />
    </div>
);

const HDControls = ({ isCharged, isCharging, canEngage, inHyperdrive, onCharge, onEngage }) => {

    if (!isCharged) return (
        <Button
            className="mt-10 as-e"
            disabled={isCharging || !canEngage}
            onClick={onCharge}
            variant={Button.Variants.EMPTY_GREEN}
            style={{ width: "150px", height: "100px" }}
        >
            {isCharging ? <Charging /> : 'INIT SEQUENCE'}
        </Button>
    );

    if (isCharged && !inHyperdrive) return (
        <Button
            className={`mt-10 as-e${canEngage ? ' blink' : ''}`}
            disabled={!canEngage}
            onClick={onEngage}
            variant={Button.Variants.GREEN}
            style={{ width: "150px", height: "100px" }}
        >
            ENGAGE
        </Button>
    );

    return null;
};

const EngageControls = ({
    status = {}, isLocked = false,
    inHyperdrive = false, cooldown = {}, charge = {},
    onEngage, onCharge,
}) => {
    const { direction, speed, target } = status;
    const normalisedDirection = Angle.normalised(direction) || 0;
    const angleDifference = (Math.abs(normalisedDirection - target.angle) % ANGLES.DEG_360);
    const angleError = 100 - (angleDifference / ANGLES.DEG_360 * 100);

    const { isCharging, isCharged } = charge;
    const { hasCooledDown, isCoolingDown } = charge;

    const canEngage = !isLocked &&
        (!isCoolingDown || hasCooledDown) && (
            speed >= 49 &&
            (angleDifference <= ANGLE_SENSITIVITY)
        );

    return (
        <div className="f-1 flex f-col">
            <div className="f-3 p-10">
                {!inHyperdrive && (
                    <>
                        <h3>Engage Heading: {direction === null ? '-' : normalisedDirection} / {target.angle} °</h3>
                        <Progress className="w-full" max={100} value={angleError} critical={100 - ANGLE_SENSITIVITY} />
                        <h3>Engage speed: {speed.toFixed(2)} / 50 m/s</h3>
                        <Progress className="w-full" max={50} value={speed} critical={0} />
                    </>
                )}
            </div>
            <HDControls
                isCharged={isCharged}
                isCharging={isCharging}
                canEngage={canEngage}
                inHyperdrive={inHyperdrive}
                onCharge={onCharge}
                onEngage={onEngage}
            />
        </div>
    );
};

export default EngageControls;