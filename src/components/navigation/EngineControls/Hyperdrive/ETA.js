import { METRICS, METRICS_SYMBOLS, Scalar, Physics } from "libs/math";

const ETA = ({ distance, speed }) => {
    let eta = null;
    if (speed >= 50) {
        const scalDis = new Scalar(distance, METRICS.DISTANCE.LS);
        const scalSpeed = new Scalar(speed, METRICS.SPEED.M_SECOND);
        const measure = distance < 500 ? METRICS.TIME.Mo : METRICS.TIME.Y;
        eta = Physics.calculateETA(scalDis, scalSpeed, measure);
    }

    // Here we can do a conversion toggle to show AU and Kms
    // const displayDistance = 
    return (
        <div className="f-1 p-10">
            <h3>Distance: {distance.toFixed(2)} Ls</h3>
            <h3>ETA: {eta && <>{eta.value.toFixed(2)} {METRICS_SYMBOLS[eta.unit]}</>}</h3>
        </div>
    );
};

export default ETA;