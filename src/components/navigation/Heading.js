import { BLUE, GREEN, DARK_GREEN, RED, YELLOW } from "enums/colours";
import { Button } from "components/common";
import { ANGLES, Geom, Angle } from "libs/math";

import "./styles/Heading.css";
import { ENGINE_TYPES } from "enums/navigation";


export const Compass = ({ heading = 0, currentHeading = 0, direction = null, target = null }) => {
    const stroke = 5;
    const radius = 80;
    const cx = radius;
    const cy = radius;
    const { x: headingX, y: headingY } = Geom.pointOnCircumference({ cx, cy }, radius - 3 * stroke, heading);
    const { x: cHeadingX, y: cHeadingY } = Geom.pointOnCircumference({ cx, cy }, radius - 3 * stroke, currentHeading);
    const { x: directionX, y: directionY } = Geom.pointOnCircumference({ cx, cy }, radius - 6 * stroke, direction === null ? 0 : direction);
    const { x: targetX, y: targetY } = Geom.pointOnCircumference({ cx, cy }, radius - 6 * stroke, target === null ? 0 : target);
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
            {target !== null && <line x1={radius} y1={radius} x2={targetX} y2={targetY} stroke={YELLOW} strokeWidth={stroke} />}
        </svg>
    );

};


const rotationButtonStyle = {
    borderTop: '1px solid black',
    borderLeft: '1px solid black'
};

const Heading = ({ onRotate = () => { }, lock = false, settings = {}, routeSetting = null }) => {
    const { heading: rawHeading, direction: rawDirection, speed, set, inHyperdrive } = settings;
    const { heading = 0 } = settings[ENGINE_TYPES.THERMAL];
    const { charge: { isCharging, isCharged } } = settings[ENGINE_TYPES.HYPER_DRIVE];
    const isHyperdriveLocked = inHyperdrive || isCharging || isCharged;

    const setHeading = heading => set({ heading });
    const direction = Angle.normalised(rawDirection);
    const currentHeading = Angle.normalised(rawHeading);
    const target = routeSetting ? routeSetting.target.angle : null;


    const canRotate = !isHyperdriveLocked && !lock && heading !== currentHeading;
    const canMatchDirection = !isHyperdriveLocked && !lock && heading !== direction && speed > 0;
    const canMatchTarget = !isHyperdriveLocked && !lock && target !== null && target !== heading;
    const angles = [
        { label: '-45', angle: Angle.normalised(heading - ANGLES.DEG_45) },
        { label: '-', angle: Angle.normalised(heading - 1) },
        { label: '+', angle: Angle.normalised(heading + 1) },
        { label: '-180', angle: Angle.normalised(heading + ANGLES.DEG_180) },
        { label: '0', angle: 0 },
        { label: '+45', angle: Angle.normalised(heading + ANGLES.DEG_45) },
    ];
    return (
        <div className="NavigationTab-heading f-1">
            <div className="f-1 flex f-row f-ae f-jsa">
                <div className="angleSpacer">
                    Head: {currentHeading} °
                </div>
                <div className="angleSpacer">
                    Dir: {direction} °
                </div>
                <div className="angleSpacer" style={{ color: YELLOW }}>
                    {routeSetting && `Targ: ${routeSetting.target.angle} °`}
                </div>
            </div>
            <Compass
                heading={heading}
                currentHeading={currentHeading}
                direction={speed > 0 ? direction : null}
                target={target}
            />
            <div className="flex w-full">
                {angles.map(({ label, angle }) => (
                    <Button
                        key={label}
                        className="f-1"
                        style={rotationButtonStyle}
                        onClick={() => setHeading(angle)}
                    >
                        {label}
                    </Button>
                ))}
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
                <Button
                    className="f-1"
                    style={{ ...rotationButtonStyle }}
                    onClick={() => setHeading(target)}
                    disabled={!canMatchTarget}
                >
                    Match Target
                </Button>
            </div>
        </div>
    );
};

export default Heading;