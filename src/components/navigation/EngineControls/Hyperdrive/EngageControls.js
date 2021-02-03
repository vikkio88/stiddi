import { Angle, ANGLES } from "libs/math";
import { Button, Progress } from "components/common";

// this might be moved to config too?
const ANGLE_SENSITIVITY = 5;

const EngageControls = ({ status = {}, isLocked = false, onEngage, inHyperdrive = false }) => {
    const { direction, speed, target } = status;
    const normalisedDirection = Angle.normalised(direction) || 0;
    const angleDifference = (Math.abs(normalisedDirection - target.angle) % ANGLES.DEG_360);
    const angleError = 100 - (angleDifference / ANGLES.DEG_360 * 100);

    const canEngage = !isLocked && (
        speed >= 50 &&
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
            <Button
                className="mt-10 as-e"
                disabled={!canEngage}
                onClick={onEngage}
                variant={Button.Variants.EMPTY_GREEN}
                style={{ width: "150px", height: "100px" }}
            >
                ENGAGE
            </Button>
        </div>
    );
};

export default EngageControls;