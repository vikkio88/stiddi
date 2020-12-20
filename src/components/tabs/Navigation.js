import eBridge, { EVENTS } from 'libs/eventBridge';

import "./styles/Navigation.css";

const burn = () => {
    eBridge.emit(EVENTS.GAME.ACTIONS.BURN, { timeout: 2000 });
};

const rotate = angle => {
    eBridge.emit(EVENTS.GAME.ACTIONS.ROTATE, { angle });
};

const fullStop = () => {
    eBridge.emit(EVENTS.GAME.ACTIONS.FULL_STOP);
};



const Navigation = () => {
    return (
        <div className="NavigationTab-wrapper">
            <div className="NavigationTab-top">
                <div className="NavigationTab-top-row">
                    <div className="NavigationTab-heading">
                        Speed:
                    </div>
                    <div className="NavigationTab-heading">
                        <button onClick={() => rotate(225)}>Rotate 225</button>
                        <button onClick={() => rotate(270)}>Rotate 270</button>
                        <button onClick={() => rotate(315)}>Rotate 315</button>
                        <button onClick={() => rotate(0)}>Rotate 0</button>
                        <button onClick={() => rotate(45)}>Rotate 45</button>
                        <button onClick={() => rotate(90)}>Rotate 90</button>
                        <button onClick={() => rotate(180)}>Rotate 180</button>
                    </div>
                </div>
                <div className="NavigationTab-engine">
                    <button onClick={burn}>Burn 2 sec</button>
                    <button onClick={fullStop}>Full Stop</button>
                </div>
            </div>
            <div className="NavigationTab-bottom">
                Fuel
            </div>
        </div>
    );
};


export default Navigation;