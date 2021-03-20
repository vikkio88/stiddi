import { Geom } from "libs/math";
import { calculateFuelCostHD } from "libs/game/navigation";
import ACTIONS from "store/actions";

import { ENGINE_TYPES } from "enums/navigation";

import ETA from "./ETA";
import Navigation from "./Navigation";
import EngageControls from "./EngageControls/EngageControls";
import TripIndicator from "./TripIndicator";

const type = ENGINE_TYPES.HYPER_DRIVE;

const Hyperdrive = ({ lock, settings, position, dispatch, route }) => {
    const { set, direction, speed, inHyperdrive, fuel } = settings;
    // exiting hyperdrive
    if (!route) return <h1>Hyperdrive Disengaged</h1>;

    const { hdTargetSpeed, charge, cooldown, times, startingPosition = null } = settings[type];
    const setTargetSpeed = hdTargetSpeed => set({ hdTargetSpeed }, type);
    const { target } = route;
    const targetPos = target.position;
    // this also has orbiting:bool
    const playerPos = position.system;
    const distance = Geom.distancePoints(playerPos, targetPos);
    const fuelCost = calculateFuelCostHD(distance, hdTargetSpeed, true);
    const hasEnoughFuel = fuel.current - fuelCost >= 1;

    const navigationProps = {
        inHyperdrive,
        hdTargetSpeed, setTargetSpeed, distance,
        charge, fuelCost
    };
    return (
        <>
            <div className="w-full flex f-row f-ac f-jsb">
                {!inHyperdrive && <Navigation {...navigationProps} />}
                <div className="f-1">
                    <ETA distance={distance} speed={speed} inHyperdrive={inHyperdrive} times={times} />
                    <EngageControls
                        status={{ speed, direction, target }}
                        isLocked={lock}
                        hasEnoughFuel={hasEnoughFuel}
                        inHyperdrive={inHyperdrive}
                        charge={charge}
                        cooldown={cooldown}
                        onCharge={() => dispatch(ACTIONS.NAV.HD.CHARGE)}
                        onEngage={() => dispatch(
                            ACTIONS.NAV.HD.ENGAGE,
                            { startingPosition: playerPos, targetPos }
                        )}
                    />
                </div>
            </div>
            {(inHyperdrive && startingPosition) && (
                <TripIndicator
                    distance={distance}
                    targetPos={targetPos}
                    startingPosition={startingPosition}
                />
            )}
        </>
    );
};

export default Hyperdrive;