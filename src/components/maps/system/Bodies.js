import { useState } from "react";
import { useStoreon } from "storeon/react";
import { hashHex } from "libs/colours";
import { BODY_TYPES } from "enums/systemMap";
import BodyInfo from "./BodyInfo";
import { Button, Circle, Star } from "components/common";

import "./styles/Bodies.css";

const Row = ({ index, name, colour, offset = 0, body, showInfo }) => {
    const hashedCoulour = hashHex(colour);
    const isPlanet = body === BODY_TYPES.PLANET;
    return (
        <div className="Bodies-Row">
            <div className="f-1 ml-5 flex f-jsa f-ac">
                {`#${index + 1 + (isPlanet ? 1 : 0)}`}
                {isPlanet ? <Circle radius={15} colour={hashedCoulour} /> : <Star size={30} colour={hashedCoulour} />}
            </div>

            <div className="f-3 ml-5">
                {`${name}`}
            </div>

            <div className="f-1 flex f-jc f-ac">
                {offset > 0 ? `${offset} Ls` : '-'}
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

const Bodies = ({ system = {}, onFocus, onPlot, onLock }) => {
    const { dispatch, player: { position } } = useStoreon('player');

    // the preselected body on a given system is a star, the main one
    const [selected, setSelected] = useState({ object: BODY_TYPES.STAR, index: 0 });
    const select = body => {
        dispatch("player:clearTargetSystem");
        setSelected(body);
    };
    const bodiesCount = system.stars.length + system.planets.length;
    return (
        <>
            <div className="ui-section p-5 mt-10 mb-5 flex f-col">
                <h3 style={{ alignSelf: "flex-start", marginTop: "5px" }}>Bodies</h3>
                <div className="flex f-1">
                    <BodyInfo
                        {...selected}
                        system={system}
                        player={position.system}
                        onFocus={onFocus}
                        onPlot={onPlot}
                        onLock={onLock}
                    />
                    <Button
                        className="mb-5"
                        style={{ alignSelf: "flex-end", height: "50px" }}
                        onClick={() => { onFocus({ object: BODY_TYPES.PLAYER }); select({ object: BODY_TYPES.PLAYER }); }}
                    >
                        Ship
                </Button>
                </div>
            </div>
            <div className={`Bodies-List${bodiesCount > 7 ? ' List-overflowing' : ''}`}>
                {system.stars.map((s, i) => (
                    <Row key={`star_${i}`} {...s} body={BODY_TYPES.STAR} showInfo={select} />
                ))}
                {system.planets.map((p, i) => (
                    <Row key={`planet_${i}`} {...p} body={BODY_TYPES.PLANET} showInfo={select} />
                ))}
            </div>
        </>
    );
};

export default Bodies;