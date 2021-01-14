const Circle = ({ radius = 50, stroke = 2, colour = 0x000000, style = {} }) => {
    const cx = radius;
    const cy = radius;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const circleProps = {
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
            <circle
                stroke={"white"}
                fill={colour}
                {...circleProps}
            />
        </svg>
    );
};

export default Circle;