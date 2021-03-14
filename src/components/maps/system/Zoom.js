import { Button } from "components/common";
import { ZOOM_LEVELS } from "enums/systemMap";

const ZoomButton = props => (
    <Button
        style={{ height: '30px', width: '80px', borderLeft: "1px black solid" }}
        {...props}
    />
);

const Zoom = ({ onZoom }) => {
    return (
        <div className="ui-section p-5">
            <h3>Zoom</h3>
            <div className="w-full flex f-row f-ac f-jsb mb-5">
                <div className="f-1 flex f-row f-ac f-jc">
                    {ZOOM_LEVELS.map(({ label, level }, index) => (
                        <ZoomButton
                            key={index}
                            onClick={() => onZoom({ level })}
                        >
                            {label}
                        </ZoomButton>
                    ))}
                </div>
                <div className="f-1 flex f-row f-ac f-jc">
                    <ZoomButton onClick={() => onZoom({ reset: true })}>
                        x1
                    </ZoomButton>
                </div>
            </div>
        </div>
    );
};

export default Zoom;