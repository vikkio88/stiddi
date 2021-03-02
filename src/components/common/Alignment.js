import "./styles/Alignment.css";

const STATUSES = {
    GREEN: 'green',
    ORANGE: 'orange',
    RED: 'red',
};

const defaultStatusCalculator = ({ value, max }) => {
    if (value > (max / 2) + 2) {
        return STATUSES.GREEN;
    }

    if (value < (max / 2) - 2) {
        return STATUSES.RED;
    }

    return STATUSES.ORANGE;
};
const Alignement = ({ min = 0, max = 10, value = 1, calculateStatus = defaultStatusCalculator, style = {}, className = '', hideStatus = false }) => {
    const status = hideStatus ? null : calculateStatus({ value, min, max });
    const positioning = Math.max((value / max * 100), min);
    const indicatorStyle = {
        left: `${positioning === min ? '0' : `${positioning - 2}%`}`,
    };

    return (
        <div className={`Alignment ${status ? `variant-${status}` : ''} ${className}`} style={style}>
            <div className="Alignment-indicator" style={indicatorStyle} />
        </div>
    );
};

Alignement.STATUSES = STATUSES;

export default Alignement;