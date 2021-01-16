import { Geom } from "libs/math";
import { hashHex } from "libs/colours";
import { BODY_TYPES } from "enums/systemMap";
import { Button, Circle } from "components/common";

const getRelativeRadius = (radius, type) => {
    const SUN_RADIUS = 50;
    if (type === BODY_TYPES.STAR) {
        return `${(radius / SUN_RADIUS).toFixed(2)} Sr (Sol radii)`;
    }

    // otherwise is a planet
    const EARTH_RADIUS = 7;
    return `${(radius / EARTH_RADIUS).toFixed(2)} Er (Earth radii)`;
};

const BodyInfo = ({
    object, index, system = {},
    player = { x: 0, y: 0, target: null },
    onFocus, onPlot }) => {
    const { target } = player;
    if (target) object = BODY_TYPES.MAP_INDICATOR;
    const isShip = ([BODY_TYPES.PLAYER].includes(object));
    const isCelestialBody = !([BODY_TYPES.PLAYER, BODY_TYPES.MAP_INDICATOR].includes(object));
    let name = isShip ? "Ship" : "Open Space";
    let type = "-";
    let radius = "-";
    let distance = (!isShip && !isCelestialBody) ? `${((Geom.distancePoints(player, target)).toFixed(2))} Ls` : "-";
    let colour = 0x000000;
    let bodyName = '-';

    if (isCelestialBody) {
        const selectedBody = system[object][index];
        name = selectedBody.name;
        bodyName = object.replace(/s$/, '');
        type = selectedBody.type.description;
        radius = getRelativeRadius(selectedBody.radius, object);
        distance = selectedBody.offset || 0;
        const angle = selectedBody.angle || 0;
        colour = selectedBody.colour;
        distance = `${(Geom.distance(angle, distance, player)).toFixed(2)} Ls`;
    }

    return (
        <div className="m-5 p-5 ui-section f-1 flex f-row f-ac f-jsb">
            <div className="f-3 flex f-col f-jc">
                <div className="Bodies-info-row f-1 f-row">
                    <strong>name:</strong> {name}
                </div>
                <div className="Bodies-info-row f-1 f-row">
                    <strong>type:</strong> {type} ({bodyName})
                </div>
                <div className="Bodies-info-row f-1 f-row">
                    <strong>radius:</strong> {radius}
                </div>
                <div className="Bodies-info-row f-1 f-row">
                    <strong>distance:</strong> {distance}
                </div>
            </div>
            <div className="f-1 flex f-ac f-jc">
                <Circle colour={hashHex(colour)} />
            </div>

            <div className="f-1 flex f-ac f-jc">
                <Button
                    disabled={!isCelestialBody}
                    onClick={() => onFocus({ object, index })}
                >
                    Focus
                </Button>
                <Button
                    disabled={isShip}
                    onClick={() => onPlot({ object, index })}
                >
                    Plot
                </Button>
            </div>
        </div>
    );
};

export default BodyInfo;