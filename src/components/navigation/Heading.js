import { BLUE, GREEN, DARK_GREEN, RED } from "enums/colours";
import { Button } from "components/common";
import { ANGLES, Geom } from "libs/math";

import "./styles/Heading.css";


export const Compass = ({ heading = 0, currentHeading = 0, direction = null }) => {
    const stroke = 5;
    const radius = 80;
    const cx = radius;
    const cy = radius;
    const { x: headingX, y: headingY } = Geom.pointOnCircumference({ cx, cy }, radius - 3 * stroke, heading);
    const { x: cHeadingX, y: cHeadingY } = Geom.pointOnCircumference({ cx, cy }, radius - 3 * stroke, currentHeading);
    const { x: directionX, y: directionY } = Geom.pointOnCircumference({ cx, cy }, radius - 6 * stroke, direction === null ? 0 : direction);
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = 0;
    return (
        <svg
            height={radius * 2}
            width={radius * 2}
        >
            <circle
                stroke={BLUE}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <line x1={radius} y1={radius} x2={cHeadingX} y2={cHeadingY} stroke={DARK_GREEN} strokeWidth={stroke} />
            <line x1={radius} y1={radius} x2={headingX} y2={headingY} stroke={GREEN} strokeWidth={stroke} />
            {direction !== null && <line x1={radius} y1={radius} x2={directionX} y2={directionY} stroke={RED} strokeWidth={stroke} />}
        </svg>
    );

};


const rotationButtonStyle = {
    borderTop: '1px solid black',
    borderLeft: '1px solid black'
};

const normalised = deg => (deg + ANGLES.DEG_360) % ANGLES.DEG_360;

const Heading = ({ direction, currentHeading, speed, onRotate = () => { }, lock = false, settings = {} }) => {
    const { heading = 0, set } = settings;
    const setHeading = heading => set({ heading });
    direction = normalised(direction);
    currentHeading = normalised(currentHeading);


    const canRotate = !lock && heading !== currentHeading;
    const canMatchDirection = !lock && heading !== direction && speed > 0;
    return (
        <div className="NavigationTab-heading f-1">
            <Compass heading={heading} currentHeading={currentHeading} direction={speed > 0 ? direction : null} />
            <div>
                Heading: {currentHeading} °
                Direction: {direction} °
            </div>
            <div className="flex w-full">
                <Button className="f-1" style={rotationButtonStyle} onClick={() => setHeading((heading - ANGLES.DEG_45 + ANGLES.DEG_360) % ANGLES.DEG_360)}>-45</Button>
                <Button className="f-1" style={rotationButtonStyle} onClick={() => setHeading((heading - 1 + ANGLES.DEG_360) % ANGLES.DEG_360)}>-</Button>
                <Button className="f-1" style={rotationButtonStyle} onClick={() => setHeading((heading + 1) % ANGLES.DEG_360)}>+</Button>
                <Button className="f-1" style={rotationButtonStyle} onClick={() => setHeading((heading + ANGLES.DEG_180) % ANGLES.DEG_360)}>-180</Button>
                <Button className="f-1" style={rotationButtonStyle} onClick={() => setHeading(0)}>0</Button>
                <Button className="f-1" style={rotationButtonStyle} onClick={() => setHeading((heading + ANGLES.DEG_45) % ANGLES.DEG_360)}>+45</Button>
            </div>
            <div className="w-full flex">
                <Button
                    className="f-3"
                    style={{ ...rotationButtonStyle }}
                    onClick={() => onRotate(heading)}
                    disabled={!canRotate}
                >
                    {`${!canRotate ? 'Current Heading' : 'Rotate to'} ${heading} °`}
                </Button>
                <Button
                    className="f-1"
                    style={{ ...rotationButtonStyle }}
                    onClick={() => setHeading(direction)}
                    disabled={!canMatchDirection}
                >
                    Match Direction
                </Button>
            </div>
        </div>
    );
};

export default Heading;