import { useStoreon } from "storeon/react";
import ACTIONS from "store/actions";
import { ENGINE_TYPES } from 'enums/navigation';
import { Heading, Speed, Engine, Fuel } from 'components/navigation';

import "./styles/Navigation.css";

const Navigation = () => {
    const {
        dispatch, navigation,
        player: {
            inHyperdrive,
            fuel,
            position,
            route,
            target
        }
    } = useStoreon('navigation', 'player');

    const routeSetting = route.isLocked ? { route, target } : null;

    const { speed, heading, direction, navigationLock, selectedEngineType } = navigation;
    const settings = {
        ...navigation.settings,
        inHyperdrive,
        fuel,
        heading,
        direction,
        speed,
        set: (settings, type = ENGINE_TYPES.THERMAL) => dispatch(ACTIONS.NAV.SETTINGS.STORE, { type, settings })
    };
    return (
        <div className="NavigationTab-wrapper">
            <div className="NavigationTab-top">
                <div className="NavigationTab-top-row">
                    <Speed speed={speed} />
                    <Heading
                        lock={navigationLock}
                        onRotate={angle => dispatch(ACTIONS.NAV.COMMIT.ROTATE, { angle })}
                        settings={settings}
                        routeSetting={routeSetting}
                    />
                </div>
                <Fuel value={fuel.current} max={fuel.max} minimal />
                <Engine
                    dispatch={dispatch}
                    engineType={selectedEngineType}
                    lock={navigationLock}
                    settings={settings}
                    route={routeSetting}
                    position={position}
                />
            </div>
        </div>
    );
};


export default Navigation;