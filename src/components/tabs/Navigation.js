import { useStoreon } from "storeon/react";
import { Heading, Speed, Engine } from 'components/navigation';
import eBridge, { EVENTS } from 'libs/eventBridge';

import "./styles/Navigation.css";

const fullStop = () => {
    eBridge.emit(EVENTS.GAME.ACTIONS.FULL_STOP);
};


const Navigation = () => {
    const { dispatch, navigation } = useStoreon('navigation');
    const burn = () => {
        dispatch('effects:shake');
        eBridge.emit(EVENTS.GAME.ACTIONS.BURN, { timeout: 2000 });
    };

    return (
        <div className="NavigationTab-wrapper">
            <div className="NavigationTab-top">
                <div className="NavigationTab-top-row">
                    <Speed speed={navigation.speed} />
                    <Heading currentHeading={navigation.heading} direction={navigation.direction} />
                </div>
                <Engine onBurn={burn} onFullStop={fullStop} />
            </div>
            <div className="NavigationTab-bottom">
                Fuel
            </div>
        </div>
    );
};


export default Navigation;