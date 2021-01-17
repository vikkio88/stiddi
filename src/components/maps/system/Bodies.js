import { useState } from "react";
import { useStoreon } from "storeon/react";

import { BODY_TYPES } from "enums/systemMap";
import Row from "./Row";
import BodyInfo from "./BodyInfo";
import { Button } from "components/common";

import "./styles/Bodies.css";


const Bodies = ({ system = {}, onFocus, onPlot, onLock }) => {
    const { dispatch, player: { position } } = useStoreon('player');

    // the preselected body on a given system is a star, the main one
    const [selected, setSelected] = useState({ object: BODY_TYPES.STAR, index: 0 });
    const select = body => {
        dispatch("player:clearTargetSystem");
        setSelected(body);
    };
    const bodiesCount = system.stars.length + system.planets.length;
    
    // this is due to the targeting system could come also from store,
    // maybe I could make it from here too and use just one.
    // as done for the settings on the navigation
    const selectedId = position.system.target === null ? `${selected.object}${selected.index}` : false;
    //
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
                    <Row
                        key={`star_${i}`}
                        {...s}
                        body={BODY_TYPES.STAR}
                        showInfo={select}
                        isSelected={selectedId === `${BODY_TYPES.STAR}${i}`}
                    />
                ))}
                {system.planets.map((p, i) => (
                    <Row
                        key={`planet_${i}`}
                        {...p}
                        body={BODY_TYPES.PLANET}
                        showInfo={select}
                        isSelected={selectedId === `${BODY_TYPES.PLANET}${i}`}
                    />
                ))}
            </div>
        </>
    );
};

export default Bodies;