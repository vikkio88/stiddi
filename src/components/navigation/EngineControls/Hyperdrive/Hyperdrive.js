import { Geom } from "libs/math";
import { ENGINE_TYPES } from "enums/navigation";

import ETA from "./ETA";
import Navigation from "./Navigation";
import EngageControls from "./EngageControls";

const type = ENGINE_TYPES.HYPER_DRIVE;

const Hyperdrive = ({ lock, settings, position, dispatch, route }) => {
    const { set, direction, speed, inHyperdrive } = settings;
    // exiting hyperdrive
    if (!route) return <h1>Hyperdrive Disengaged</h1>;

    const { hdTargetSpeed, charge, cooldown, times } = settings[type];
    const setTargetSpeed = hdTargetSpeed => set({ hdTargetSpeed }, type);
    const { target } = route;
    const targetPos = target.position;
    // this also has orbiting:bool
    const playerPos = position.system;
    const distance = Geom.distancePoints(playerPos, targetPos);
    const navigationProps = {
        inHyperdrive, times,
        hdTargetSpeed, setTargetSpeed, distance,
        charge
    };

    return (
        <div className="w-full flex f-row f-ac f-jsb">
            <Navigation {...navigationProps} />
            <div className="f-1">
                <ETA distance={distance} speed={speed} inHyperdrive={inHyperdrive} />
                <EngageControls
                    status={{ speed, direction, target }}
                    isLocked={lock}
                    inHyperdrive={inHyperdrive}
                    charge={charge}
                    cooldown={cooldown}
                    onCharge={() => dispatch('navigation:chargeHyperdrive')}
                    onEngage={() => dispatch(
                        'navigation:engageHyperdrive',
                        { startingPosition: playerPos, targetPos }
                    )}
                />
            </div>
        </div>
    );
};

export default Hyperdrive;