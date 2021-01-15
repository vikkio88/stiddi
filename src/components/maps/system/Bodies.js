import { useState } from "react";
import { useStoreon } from "storeon/react";
import { Button, Circle, Star } from "components/common";
import { Geom } from "libs/math";

import "./styles/Bodies.css";

const BODY_TYPES = {
    // plural as they define an array of them
    STAR: 'stars',
    PLANET: 'planets',

    PLAYER: 'player'
};


const Row = ({ index, name, colour, offset = 0, body, showInfo }) => {
    const hashedCoulour = hashHex(colour);
    const isPlanet = body === BODY_TYPES.PLANET;
    return (
        <div className="Bodies-Row w-full">
            <div className="f-1 ml-5 flex f-jsa f-ac">
                {`#${index + 1 + (isPlanet ? 1 : 0)}`}
                {isPlanet ? <Circle radius={15} colour={hashedCoulour} /> : <Star size={30} colour={hashedCoulour} />}
            </div>

            <div className="f-3 ml-5">
                {`${name}`}
            </div>

            <div className="f-1 flex f-jc f-ac">
                {`${offset} Ls`}
            </div>

            <div className="f-2 flex f-je f-ac pr-5">
                <Button
                    style={{ height: "30px" }}
                    onClick={() => showInfo({ object: body, index })}
                >
                    Info
                </Button>
            </div>

        </div>
    );
};

function hashHex(hex) {
    return `#${hex.toString(16).padStart(6, '0')}`;
}

const BodyInfo = ({ object, index, system = {}, player = { x: 0, y: 0 }, onFocus = () => { } }) => {
    const isShipSelected = object === BODY_TYPES.PLAYER;
    let name = "Ship";
    let type = "-";
    let radius = "-";
    let distance = "-";
    let colour = 0x000000;
    let bodyName = '-';

    if (!isShipSelected) {
        const selectedBody = system[object][index];
        name = selectedBody.name;
        bodyName = object.replace(/s$/, '');
        type = selectedBody.type.description;
        radius = selectedBody.radius;
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
                    disabled={isShipSelected}
                    onClick={() => onFocus({ object, index })}
                >
                    Focus
                </Button>
                <Button
                    disabled={isShipSelected}
                >
                    Target
                </Button>
            </div>
        </div>
    );
};

const Bodies = ({ system = {}, onFocus }) => {

    const { player: { position } } = useStoreon('player');

    // the preselected body on a given system is a star, the main one
    const [selected, setSelected] = useState({ object: BODY_TYPES.STAR, index: 0 });
    const bodiesCount = system.stars.length + system.planets.length;
    return (
        <>
            <div className="ui-section p-5 mt-10 mb-5 flex f-col">
                <h3 style={{ alignSelf: "flex-start", marginTop: "5px" }}>Bodies</h3>
                <div className="flex f-1">
                    <BodyInfo {...selected} system={system} player={position.system} onFocus={onFocus} />
                    <Button
                        className="mb-5"
                        style={{ alignSelf: "flex-end", height: "50px" }}
                        onClick={() => { onFocus({ object: BODY_TYPES.PLAYER }); setSelected({ object: BODY_TYPES.PLAYER }); }}
                    >
                        Ship
                </Button>
                </div>
            </div>
            <div className={`Bodies-List${bodiesCount > 6 ? ' List-overflowing' : ''}`}>
                {system.stars.map((s, i) => (
                    <Row key={`star_${i}`} {...s} body={BODY_TYPES.STAR} showInfo={setSelected} />
                ))}
                {system.planets.map((p, i) => (
                    <Row key={`planet_${i}`} {...p} body={BODY_TYPES.PLANET} showInfo={setSelected} />
                ))}
            </div>
        </>
    );
};

export default Bodies;