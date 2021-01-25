import { useStoreon } from "storeon/react";
import { ENGINE_TYPES } from 'enums/navigation';
import { Heading, Speed, Engine, Fuel } from 'components/navigation';

import "./styles/Navigation.css";

const Navigation = () => {
    const {
        dispatch, navigation,
        player: {
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
        heading,
        direction,
        speed,
        set: (settings, type = ENGINE_TYPES.THERMAL) => dispatch('navigation:storeSetting', { type, settings })
    };
    return (
        <div className="NavigationTab-wrapper">
            <div className="NavigationTab-top ui-section">
                <div className="NavigationTab-top-row">
                    <Speed speed={speed} />
                    <Heading
                        lock={navigationLock}
                        onRotate={angle => dispatch('commit:rotate', { angle })}
                        settings={settings}
                    />
                </div>
                <Engine
                    dispatch={dispatch}
                    engineType={selectedEngineType}
                    lock={navigationLock}
                    settings={settings}
                    route={routeSetting}
                    position={position}
                />
            </div>
            <div className="NavigationTab-fuel-wrapper ui-section">
                <Fuel value={fuel.current} max={fuel.max} />
            </div>
        </div>
    );
};


export default Navigation;