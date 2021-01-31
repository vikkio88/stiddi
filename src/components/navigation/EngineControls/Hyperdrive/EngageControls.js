import { Button } from "components/common";

const EngageControls = ({ status = {}, canEngage = false, onEngage }) => {
    const { direction, speed, target } = status;
    return (
        <>
            <h1>Engage Heading: {direction === null ? '-' : direction} / {target.angle} °</h1>
            <h1>Engage speed: {speed.toFixed(2)} / 50 m/s</h1>
            <Button
                disabled={!canEngage}
                onClick={onEngage}
                variant={Button.Variants.EMPTY_GREEN}
            >
                ENGAGE
            </Button>
        </>
    );
};

export default EngageControls;