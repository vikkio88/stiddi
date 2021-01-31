import { METRICS_SYMBOLS } from "libs/math";
const ETA = ({ distance, eta = null }) => {
    return (
        <>
            <h2>Distance: {distance.toFixed(2)} Ls</h2>
            <h2>ETA: {eta && <>{eta.value.toFixed(2)} {METRICS_SYMBOLS[eta.unit]}</>}</h2>
        </>
    );
};

export default ETA;