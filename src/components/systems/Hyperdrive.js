import { Countdown } from "components/common";
import { StatusLabel } from "./components";

const Hyperdrive = ({ settings }) => {
    const { cooldown } = settings;
    const status = cooldown.hasCooledDown ? StatusLabel.STATUSES.OK : StatusLabel.STATUSES.DEGRADED;
    return (
        <div className="ui-section p-10">
            <h3>Hyperdrive</h3>
            <StatusLabel label="STATUS" status={status}>
                {cooldown.startedAt ? <>Cooling down: <Countdown start={cooldown.startedAt} duration={cooldown.duration / 1000} /></> : null}
            </StatusLabel>
        </div>
    );

};
export default Hyperdrive;