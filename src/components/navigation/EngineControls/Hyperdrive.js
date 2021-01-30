import { ANGLES, Physics, Geom, Scalar, METRICS, METRICS_SYMBOLS } from "libs/math";
import { Button } from "components/common";

const ANGLE_SENSITIVITY = 5;

const Hyperdrive = ({ lock, settings, position, dispatch, route }) => {
    const { direction, speed } = settings;
    const { target } = route;
    const targetPos = target.position;
    // this also has orbiting:bool
    const playerPos = position.system;
    const distance = Geom.distancePoints(playerPos, targetPos);

    const canEngage = !lock
        && (
            speed >= 50
            && (
                (Math.abs(direction - target.angle + ANGLES.DEG_360) % ANGLES.DEG_360)
                <= ANGLE_SENSITIVITY
            )
        );

    let eta = null;
    if (speed >= 50) {
        const scalDis = new Scalar(distance, METRICS.DISTANCE.LS);
        const scalSpeed = new Scalar(speed, METRICS.SPEED.M_SECOND);
        const measure = distance < 500 ? METRICS.TIME.Mo : METRICS.TIME.Y;
        eta = Physics.calculateETA(scalDis, scalSpeed, measure);
    }

    return (
        <>
            <h2>Distance: {distance.toFixed(2)} Ls</h2>
            <h2>ETA: {eta && <>{eta.value.toFixed(2)} {METRICS_SYMBOLS[eta.unit]}</>}</h2>
            <h1>Engage Heading: {direction === null ? '-' : direction} / {target.angle} °</h1>
            <h1>Engage speed: {speed.toFixed(2)} / 50 m/s</h1>
            <Button
                disabled={!canEngage}
                onClick={() => dispatch('navigation:engageHyperdrive')}
                variant={Button.Variants.EMPTY_GREEN}
            >
                ENGAGE
            </Button>
        </>
    );
};

export default Hyperdrive;