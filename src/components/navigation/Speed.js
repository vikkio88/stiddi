import { useState, useEffect } from "react";
import { Button } from "components/common";
import { C, Numbers } from "libs/math";
import "./styles/Speed.css";

const UNITS = {
    MS: {
        label: 'm/s',
        conversion: speed => Numbers.kFormat(speed)
    },
    KH: {
        label: 'Km/h',
        conversion: speed => Numbers.kFormat(speed * 3.6)
    },
    MH: {
        label: 'Mm/h',
        conversion: speed => Numbers.kFormat(speed * .0036)
    },
    C: {
        label: 'c',
        conversion: speed => Numbers.kFormat(speed / C)
    },
};

// speed is always m/s
const Speed = ({ speed = 0 }) => {
    const fallbackUnitIndex = speed > (C / 3) ? 3 : 0;
    const [unitIndex, setUnit] = useState(fallbackUnitIndex);
    useEffect(() => setUnit(fallbackUnitIndex), [fallbackUnitIndex]);
    const unit = UNITS[Object.keys(UNITS)[unitIndex]];

    const toggle = () => {
        const newIndex = (unitIndex + 1) % Object.keys(UNITS).length;
        setUnit(newIndex);
    };

    return (
        <div className="NavigationTab-speed f-1">
            <h2>Speed</h2>
            <h1>
                <span className="speed">{unit.conversion(speed)}</span> {unit.label}
            </h1>
            <div className="speed-actions">
                <Button style={{ width: '30px', height: '30px' }} onClick={() => setUnit(fallbackUnitIndex)} variant={Button.Variants.GREEN} />
                <Button style={{ width: '30px', height: '30px' }} onClick={toggle} variant={Button.Variants.RED} />
            </div>
        </div>
    );
};

export default Speed;