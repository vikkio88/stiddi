import { useStoreon } from "storeon/react";
import { Heading, Speed, Engine, Fuel } from 'components/navigation';

import "./styles/Navigation.css";

const Navigation = () => {
    const { dispatch, navigation, player: { position, fuel, route, target } } = useStoreon('navigation', 'player');

    const { speed, heading, direction, navigationLock, subtab } = navigation;
    const settings = {
        ...navigation.settings,
        set: settings => dispatch('navigation:storeSetting', settings)
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
                    selectedTab={subtab}
                    lock={navigationLock}
                    speed={speed}
                    settings={settings}
                />
            </div>
            <div className="NavigationTab-bottom ui-section">
                <Fuel value={fuel.current} max={fuel.max} />
            </div>
        </div>
    );
};


export default Navigation;