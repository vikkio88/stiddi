import { useStoreon } from "storeon/react";
import { Heading, Speed, Engine } from 'components/navigation';
import eBridge, { EVENTS } from 'libs/eventBridge';

import "./styles/Navigation.css";

const fullStop = () => {
    eBridge.emit(EVENTS.GAME.ACTIONS.FULL_STOP);
};


const Navigation = () => {
    const { dispatch, navigation } = useStoreon('navigation');
    const burn = (time, throttlePercentage = 25) => {
        time = time * 1000;
        const throttle = throttlePercentage / 100;
        dispatch('commit:burn', { timeout: time, throttle });
    };

    const { speed, heading, direction, navigationLock } = navigation;

    return (
        <div className="NavigationTab-wrapper">
            <div className="NavigationTab-top">
                <div className="NavigationTab-top-row">
                    <Speed speed={speed} />
                    <Heading
                        currentHeading={heading}
                        direction={direction}
                        speed={speed}
                        lock={navigationLock}
                        onRotate={angle => dispatch('commit:rotate', { angle })}
                    />
                </div>
                <Engine
                    onBurn={burn}
                    onFullStop={fullStop}
                    lock={navigationLock}
                    speed={speed}
                />
            </div>
            <div className="NavigationTab-bottom">
                Fuel
            </div>
        </div>
    );
};


export default Navigation;