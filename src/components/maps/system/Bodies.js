import { useStoreon } from "storeon/react";

import { BODY_TYPES } from "enums/systemMap";
import Row from "./Row";
import BodyInfo from "./BodyInfo";
import { Button } from "components/common";

import "./styles/Bodies.css";


const Bodies = ({ system = {}, onFocus, onPlot }) => {
    const { dispatch, player: { position, target = {}, route } } = useStoreon('player');

    const select = target => {
        dispatch("player:targetSystem", { target });
    };

    const bodiesCount = system.stars.length + system.planets.length;
    const selectedId = target === null ? null : `${target.object}${target.index}`;
    return (
        <>
            <div className="ui-section p-5 mt-10 mb-5 flex f-col">
                <h3 style={{ alignSelf: "flex-start", marginTop: "5px" }}>Bodies</h3>
                <div className="flex f-1">
                    <BodyInfo
                        {...target}
                        system={system}
                        playerPosition={position.system}
                        onFocus={onFocus}
                        onPlot={onPlot}
                        onLock={() => console.log('onLock')}
                        onClear={() => dispatch('player:clearTargetSystem')}
                        isPlotted={route.isPlotted}
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