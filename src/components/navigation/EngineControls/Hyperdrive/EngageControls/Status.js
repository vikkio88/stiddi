import { Countdown } from "components/common";

const Status = ({ charge, isCoolingDown }) => {
    if (charge && charge.isCharging) return <h3 className="t-green f-1 flex f-ac f-jc"><Countdown start={charge.startedAt} duration={charge.duration / 1000} /></h3>;

    if (isCoolingDown) return <h3 className="blink t-red f-1 flex f-ac f-jc">HD Cooling down...</h3>;

    return <div className="f-1" />;
};


export default Status;