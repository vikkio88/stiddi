import { ANGLES, Physics, Geom, Scalar, METRICS } from "libs/math";

import ETA from "./ETA";
import EngageControls from "./EngageControls";

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
            <ETA distance={distance} eta={eta} />
            <EngageControls
                status={{ speed, direction, target }}
                canEngage={canEngage}
                onEngage={() => dispatch('navigation:engageHyperdrive')}
            />
        </>
    );
};

export default Hyperdrive;