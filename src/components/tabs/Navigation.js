import { useStoreon } from "storeon/react";
import { ENGINE_TYPES } from 'enums/navigation';
import { Heading, Speed, Engine, Fuel } from 'components/navigation';

import "./styles/Navigation.css";

const Navigation = () => {
    const {
        dispatch, navigation,
        player: {
            fuel,
            /*
            // those will be needed in
            // the other Engine types
            position,
            */
            route,
            target
        }
    } = useStoreon('navigation', 'player');

    const routeSetting = route.isLocked ? { route, target } : null;

    const { speed, heading, direction, navigationLock, selectedEngineType } = navigation;
    const settings = {
        ...navigation.settings,
        set: (settings, type = ENGINE_TYPES.THERMAL) => dispatch('navigation:storeSetting', { type, settings })
    };
    return (
        <div className="NavigationTab-wrapper">
            <div className="NavigationTab-top ui-section">
                <div className="NavigationTab-top-row">
                    <Speed speed={speed} />
                    <Heading
                        currentHeading={heading}
                        direction={direction}
                        speed={speed}
                        lock={navigationLock}
                        onRotate={angle => dispatch('commit:rotate', { angle })}
                        settings={settings}
                    />
                </div>
                <Engine
                    dispatch={dispatch}
                    engineType={selectedEngineType}
                    lock={navigationLock}
                    speed={speed}
                    settings={settings}
                    route={routeSetting}
                />
            </div>
            <div className="NavigationTab-fuel-wrapper ui-section">
                <Fuel value={fuel.current} max={fuel.max} />
            </div>
        </div>
    );
};


export default Navigation;