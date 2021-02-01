import { Geom } from "libs/math";

import ETA from "./ETA";
import EngageControls from "./EngageControls";

const Hyperdrive = ({ lock, settings, position, dispatch, route }) => {
    const { direction, speed } = settings;
    const { target } = route;
    const targetPos = target.position;
    // this also has orbiting:bool
    const playerPos = position.system;
    const distance = Geom.distancePoints(playerPos, targetPos);

    return (
        <div className="w-full flex f-row f-ac f-jsb">
            <div className="f-1">
            </div>
            <div className="f-1">
                <ETA distance={distance} speed={speed} />
                <EngageControls
                    status={{ speed, direction, target }}
                    isLocked={lock}
                    onEngage={() => dispatch('navigation:engageHyperdrive')}
                />
            </div>
        </div>
    );
};

export default Hyperdrive;