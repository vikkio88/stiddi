import { useStoreon } from "storeon/react";
import { Heading, Speed, Engine, Fuel } from 'components/navigation';

import "./styles/Navigation.css";

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
            <div className="NavigationTab-top ui-section">
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
                    onFullStop={() => dispatch('commit:fullstop')}
                    lock={navigationLock}
                    speed={speed}
                />
            </div>
            <div className="NavigationTab-bottom ui-section">
                <Fuel value={78} max={80}/>
            </div>
        </div>
    );
};


export default Navigation;