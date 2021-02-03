import { METRICS, METRICS_SYMBOLS, Scalar, Physics } from "libs/math";

const H1 = ({ children }) => (<h1>{children}</h1>);
const H3 = ({ children }) => (<h3>{children}</h3>);

const ETA = ({ distance, speed, inHyperdrive = false }) => {
    let eta = null;
    if (speed >= 50) {
        const scalDis = new Scalar(distance, METRICS.DISTANCE.LS);
        const scalSpeed = new Scalar(speed, METRICS.SPEED.M_SECOND);
        const measure = inHyperdrive ? METRICS.TIME.S : (distance < 500 ? METRICS.TIME.Mo : METRICS.TIME.Y);
        eta = Physics.calculateETA(scalDis, scalSpeed, measure);
    }

    // Here we can do a conversion toggle to show AU and Kms
    // const displayDistance = 
    const Wrap = inHyperdrive ? H1 : H3;
    return (
        <div className="f-1 p-10">
            <h2>Target</h2>
            <h3>Distance: {distance.toFixed(2)} Ls</h3>
            <Wrap>ETA: {eta ? (<>{eta.value.toFixed(2)} {METRICS_SYMBOLS[eta.unit]}</>) : '-'}</Wrap>
        </div>
    );
};

export default ETA;