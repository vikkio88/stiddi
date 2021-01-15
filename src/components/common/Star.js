const RATIO = 260 / 245;

const Star = ({ size = 245, colour = "black" }) => {
    const height = size;
    const width = RATIO * height;
    return (
        <svg viewBox="0 0 245 260" height={height} width={width}>
            <path fill={colour} d="m55,237 74-228 74,228L9,96h240" />
        </svg>
    );
};

export default Star;