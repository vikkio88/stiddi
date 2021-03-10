import { Button } from "components/common";

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
                    <ZoomButton onClick={() => onZoom({ level: 4 })}>
                        x5
                    </ZoomButton>
                    <ZoomButton onClick={() => onZoom({ level: 3 })}>
                        x4
                    </ZoomButton>
                    <ZoomButton onClick={() => onZoom({ level: .9 })}>
                        x3
                    </ZoomButton>
                    <ZoomButton onClick={() => onZoom({ level: .2 })}>
                        x2
                    </ZoomButton>
                    <ZoomButton onClick={() => onZoom({ level: .09 })}>
                        x1
                    </ZoomButton>
                </div>
                <div className="f-1 flex f-row f-ac f-jc">
                    <ZoomButton onClick={() => onZoom({ reset: true })}>
                        Reset
                    </ZoomButton>
                </div>
            </div>
        </div>
    );
};

export default Zoom;