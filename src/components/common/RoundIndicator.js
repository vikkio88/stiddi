import { BLUE } from "enums/colours";

const RoundIndicator = ({ radius = 50, stroke = 5, max = 100, value = 10, colour = BLUE, showRail = false, railColour = "white", style = {}, children = null }) => {
    const cx = radius;
    const cy = radius;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - ((value / max) * circumference);
    const circleProps = {
        fill: "transparent",
        strokeWidth: stroke,
        strokeDasharray: `${circumference} ${circumference}`,
        r: normalizedRadius,
        cx,
        cy
    };
    return (
        <svg
            style={style}
            height={radius * 2}
            width={radius * 2}
        >
            {showRail && (
                <circle
                    stroke={railColour}
                    {...circleProps}
                />
            )}
            <circle
                stroke={colour}
                style={{ strokeDashoffset }}
                {...circleProps}
            />
            <text textAnchor="middle" x="50%" y="50%" dy={children ? ".1em" : ".3em"} style={{ fill: "white" }}>{value}</text>
            {children && <text textAnchor="middle" x="50%" y="50%" dy="1.3em" style={{ fill: "white" }}>{children}</text>}
        </svg>
    );
};

export default RoundIndicator;