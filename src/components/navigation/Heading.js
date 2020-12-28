import { useState } from "react";
import { Button } from "components/common";
import { Geom } from "libs/math";
import eBridge, { EVENTS } from 'libs/eventBridge';

import "./styles/Heading.css";


const rotate = angle => {
    eBridge.emit(EVENTS.GAME.ACTIONS.ROTATE, { angle });
};

export const Compass = ({ heading = 0, direction = 0 }) => {
    const stroke = 5;
    const radius = 80;
    const cx = radius;
    const cy = radius;
    const { x: headingX, y: headingY } = Geom.pointOnCircumference({ cx, cy }, radius - 3 * stroke, heading);
    const { x: directionX, y: directionY } = Geom.pointOnCircumference({ cx, cy }, radius - 6 * stroke, direction);
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
            <line x1={radius} y1={radius} x2={headingX} y2={headingY} stroke="green" strokeWidth={stroke} />
            <line x1={radius} y1={radius} x2={directionX} y2={directionY} stroke="red" strokeWidth={stroke} />
        </svg>
    );

};


const rotationButtonStyle = {
    borderTop: '1px solid black',
    borderLeft: '1px solid black'
};
const Heading = () => {
    const [heading, setHeading] = useState(0);
    return (
        <div className="NavigationTab-heading">
            <Compass heading={heading} direction={0} />
            <div>
                <Button style={rotationButtonStyle} onClick={() => setHeading((heading - 1) % 360)}>-</Button>
                <Button style={rotationButtonStyle} onClick={() => setHeading((heading + 1) % 360)}>+</Button>
                <Button style={rotationButtonStyle} onClick={() => setHeading((heading + 180) % 360)}>-180</Button>
                <Button style={rotationButtonStyle} onClick={() => setHeading(0)}>0</Button>
                <Button style={rotationButtonStyle} onClick={() => setHeading((heading + 45) % 360)}>+45</Button>
            </div>
            <Button style={{ width: '100%', ...rotationButtonStyle }} onClick={() => rotate(heading)}>Rotate to {`${heading} °`}</Button>
        </div>
    );
};

export default Heading;