import { METRICS, METRICS_SYMBOLS, Scalar, Physics } from "libs/math";
import { Countdown } from "components/common";

const H1 = ({ children }) => (<h1>{children}</h1>);
const H3 = ({ children }) => (<h3>{children}</h3>);

const ETA = ({ distance, speed, inHyperdrive = false, times = {}, }) => {
    let eta = null;
    if (speed >= 20) {
        const scalDis = new Scalar(distance, METRICS.DISTANCE.LS);
        const scalSpeed = new Scalar(speed, METRICS.SPEED.M_SECOND);
        const measure = inHyperdrive ? METRICS.TIME.S : (distance < 500 ? METRICS.TIME.Mo : METRICS.TIME.Y);
        eta = Physics.calculateETA(scalDis, scalSpeed, measure);
    }

    // Here we can do a conversion toggle to show AU and Kms
    // const displayDistance = 
    const Wrap = inHyperdrive ? H1 : H3;
    return (
        <div className={`f-1 p-10 flex f-row ${inHyperdrive ? 'f-ac f-jsb' : ''}`}>
            {inHyperdrive && (
                <div>
                    <h2>Time to Destination</h2>
                    <h1 className="eta">
                        <Countdown start={times.engagedAt} duration={times.duration / 1000} />
                    </h1>
                </div>
            )}
            <div>
                <h2>Target</h2>
                <Wrap>Distance: {distance.toFixed(2)} Ls</Wrap>
                {!inHyperdrive && (<h3>ETA: {eta ? (<>{eta.value.toFixed(2)} {METRICS_SYMBOLS[eta.unit]}</>) : '-'}</h3>)}
            </div>
        </div>
    );
};

export default ETA;