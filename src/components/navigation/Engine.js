import { Button } from "components/common";
import "./styles/Engine.css";

const Engine = ({ onBurn, onFullStop }) => {
    return (
        <div className="NavigationTab-engine">
            <Button onClick={onBurn} variant={Button.Variants.GREEN}>Burn 2 sec</Button>
            <Button onClick={onFullStop} variant={Button.Variants.RED}>Full Stop</Button>
        </div>
    );
};


export default Engine;