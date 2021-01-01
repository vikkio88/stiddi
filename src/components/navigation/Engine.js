import { useState } from "react";
import { Button, RoundIndicator, Slider } from "components/common";
import "./styles/Engine.css";

const Engine = ({ onBurn, onFullStop }) => {
    const [burnTime, setBurnTime] = useState(2);
    return (
        <div className="NavigationTab-engine">
            <div className="NavigationTab-engine-burn">
                <div className="NavigationTab-engine-burn-timer">
                    <div className="w-full flex f-row f-ac f-jsa">
                        <h4>Burn Time</h4>
                        <RoundIndicator value={burnTime} max={10} showRail>
                            sec
                        </RoundIndicator>
                    </div>
                    <Slider
                        onChange={e => setBurnTime(e.target.value)}
                        value={burnTime}
                        className="w-full"
                    />
                </div>
                <div className="NavigationTab-engine-burn-actions">
                    <Button
                        onClick={() => onBurn(burnTime)}
                        variant={Button.Variants.EMPTY_GREEN}
                        style={{ width: "150px", height: "100px" }}
                    >
                        BURN
                    </Button>
                </div>
            </div>
            <Button onClick={onFullStop} variant={Button.Variants.RED}>Full Stop</Button>
        </div>
    );
};


export default Engine;