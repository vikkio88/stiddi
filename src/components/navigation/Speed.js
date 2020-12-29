import { useState } from "react";
import { Button } from "components/common";
import { C } from "libs/math";
import "./styles/Speed.css";

const UNITS = {
    MS: {
        label: 'm/s',
        conversion: speed => speed.toFixed(2)
    },
    KH: {
        label: 'Km/h',
        conversion: speed => (speed * 3.6).toFixed(2)
    },
    MH: {
        label: 'Mm/h',
        conversion: speed => (speed * .0036).toFixed(2)
    },
    PC: {
        label: '%c',
        conversion: speed => (speed / C * 100).toFixed(2)
    },
    C: {
        label: 'c',
        conversion: speed => (speed / C).toFixed(2)
    },
};

const Speed = ({ speed = 0 }) => {
    const [unitIndex, setUnit] = useState(0);
    const unit = UNITS[Object.keys(UNITS)[unitIndex]];

    const toggle = () => {
        const newIndex = (unitIndex + 1) % Object.keys(UNITS).length;
        setUnit(newIndex);
    };

    return (
        <div className="NavigationTab-speed">
            <h2>Speed</h2>
            <h1>
                <span className="speed">{unit.conversion(speed)}</span> {unit.label}
            </h1>
            <div className="speed-actions">
                <Button style={{ width: '30px', height: '30px' }} onClick={() => setUnit(0)} variant={Button.Variants.GREEN} />
                <Button style={{ width: '30px', height: '30px' }} onClick={toggle} variant={Button.Variants.RED} />
            </div>
        </div>
    );
};

export default Speed;