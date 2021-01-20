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

const EmptySelection = () => (<div className="m-5 p-5 ui-section f-1 flex f-row f-ac f-jsb">Nothing Selected</div>);

const BodyInfo = (
    {
        //target
        object,
        index,
        system = {},
        position = {},
        // end target
        playerPosition = { x: 0, y: 0 },
        onFocus,
        onPlot,
        onLock,
        onClear,
        //
        route = {}
    }
) => {
    if (!object) return <EmptySelection />;

    const { isPlotted, isLocked } = route;

    const isShip = ([BODY_TYPES.PLAYER].includes(object));
    const isCelestialBody = !([BODY_TYPES.PLAYER, BODY_TYPES.MAP_INDICATOR].includes(object));
    let name = isShip ? "Ship" : "Open Space";
    let type = "-";
    let radius = "-";
    let distance = (!isShip && !isCelestialBody) ? `${((Geom.distancePoints(playerPosition, position)).toFixed(2))} Ls` : "-";
    let colour = 0x000000;
    let bodyName = null;

    if (isCelestialBody) {
        const selectedBody = system[object][index];
        name = selectedBody.name;
        bodyName = object.replace(/s$/, '');
        type = selectedBody.type.description;
        radius = getRelativeRadius(selectedBody.radius, object);
        distance = selectedBody.offset || 0;
        const angle = selectedBody.angle || 0;
        colour = selectedBody.colour;
        distance = `${(Geom.distance(angle, distance, playerPosition)).toFixed(2)} Ls`;
    }

    return (
        <div className="m-5 p-5 ui-section f-1 flex f-row f-ac f-jsb">
            <div className="f-3 flex f-col f-jc">
                <div className="Bodies-info-row f-1 f-row">
                    <strong>name:</strong> {name}
                </div>
                <div className="Bodies-info-row f-1 f-row">
                    <strong>type:</strong> {type} {bodyName && `${bodyName}`}
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
                {!isPlotted && (
                    <>
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
                    </>
                )}
                {isPlotted && (
                    <>
                        <Button
                            variant={Button.Variants.RED}
                            onClick={onClear}
                        >
                            X
                        </Button>
                        <Button
                            variant={isLocked ? Button.Variants.GREEN : Button.Variants.EMPTY_GREEN}
                            disabled={isLocked}
                            onClick={onLock}
                        >
                            {isLocked ? 'LOCKED' : 'Lock'}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default BodyInfo;