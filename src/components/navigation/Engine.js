import { useState } from "react";
import { Button, Slider } from "components/common";
import "./styles/Engine.css";

const Engine = ({ onBurn, onFullStop }) => {
    const [burnTime, setBurnTime] = useState(2);
    return (
        <div className="NavigationTab-engine">
            <Slider onChange={e => setBurnTime(e.target.value)} value={burnTime} />
            <Button onClick={() => onBurn(burnTime)} variant={Button.Variants.GREEN}>Burn {burnTime}s</Button>
            <Button onClick={onFullStop} variant={Button.Variants.RED}>Full Stop</Button>
        </div>
    );
};


export default Engine;