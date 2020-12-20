import { useState } from "react";
import { Button } from "components/common";
import eBridge, { EVENTS } from 'libs/eventBridge';


const rotate = angle => {
    eBridge.emit(EVENTS.GAME.ACTIONS.ROTATE, { angle });
};

export const Compass = () => {
    const radius = 80;
    const stroke = 5;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = 0;
    return (
        <svg
            height={radius * 2}
            width={radius * 2}
        >
            <circle
                stroke="blue"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <line x1={radius} y1={radius} x2={radius} y2={0 + 2 * stroke} stroke="green" strokeWidth={stroke} />
            <line x1={radius} y1={radius} x2={radius} y2={0 + 6 * stroke} stroke="red" strokeWidth={stroke} />
        </svg>
    );

};

const Heading = () => {
    const [heading, setHeading] = useState(0);
    const format = e => {
        const value = e.target.value % 360;
        setHeading(value);
    };
    return (
        <>
            <Compass />
            <input type="number" max="360" min="0" step="1" onChange={format} value={heading} />
            <Button onClick={() => rotate(heading)}>Rotate to {`${heading} °`}</Button>
        </>
    );
};

export default Heading;