import { useStoreon } from "storeon/react";
import { Button } from 'components/common';
import { Heading } from 'components/navigation';
import eBridge, { EVENTS } from 'libs/eventBridge';

import "./styles/Navigation.css";

const fullStop = () => {
    eBridge.emit(EVENTS.GAME.ACTIONS.FULL_STOP);
};


const Navigation = () => {
    const { dispatch } = useStoreon();
    const burn = () => {
        dispatch('effects:shake');
        eBridge.emit(EVENTS.GAME.ACTIONS.BURN, { timeout: 2000 });
    };

    return (
        <div className="NavigationTab-wrapper">
            <div className="NavigationTab-top">
                <div className="NavigationTab-top-row">
                    <div className="NavigationTab-heading">
                        Speed:
                    </div>
                    <div className="NavigationTab-heading">
                        <Heading />
                    </div>
                </div>
                <div className="NavigationTab-engine">
                    <Button onClick={burn} variant={Button.Variants.GREEN}>Burn 2 sec</Button>
                    <Button onClick={fullStop} variant={Button.Variants.RED}>Full Stop</Button>
                </div>
            </div>
            <div className="NavigationTab-bottom">
                Fuel
            </div>
        </div>
    );
};


export default Navigation;