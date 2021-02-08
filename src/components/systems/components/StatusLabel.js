import { RED, GREEN, ORANGE } from "enums/colours";
const StatusLabel = ({ label, status = STATUSES.OK, children = null }) => {
    return (
        <div className="f-1 flex f-row f-ac f-jsb ui-section p-10 mt-10">
            <h4 className="f-1">{label}</h4>
            <div
                className="f-1 flex f-ac f-jc p-5"
                style={{ backgroundColor: COLOUR_MAP[status], color: 'white', fontWeight: 'bold' }}
            >
                {children ? children : status.toUpperCase()}
            </div>
        </div>
    );
};

const STATUSES = {
    OK: 'ok',
    DEGRADED: 'degraded',
    DOWN: 'down'
};

const COLOUR_MAP = {
    [STATUSES.OK]: GREEN,
    [STATUSES.DEGRADED]: ORANGE,
    [STATUSES.DOWN]: RED,
};

StatusLabel.STATUSES = STATUSES;


export default StatusLabel;