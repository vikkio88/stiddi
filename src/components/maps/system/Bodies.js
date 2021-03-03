import { useStoreon } from "storeon/react";

import { BODY_TYPES } from "enums/systemMap";
import Row from "./Row";
import BodyInfo from "./BodyInfo";
import { Button } from "components/common";

import "./styles/Bodies.css";


const Bodies = ({ system = {}, onFocus, onPlot }) => {
    const { dispatch, player: { inHyperdrive, position, target = {}, route } } = useStoreon('player');

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
                        onLock={() => dispatch('player:lockRouteSystem')}
                        onClear={() => dispatch('player:clearRouteSystem')}
                        inHyperdrive={inHyperdrive}
                        route={route}
                    />
                    <Button
                        className="mb-5"
                        style={{ alignSelf: "flex-end", height: "50px" }}
                        onClick={() => {
                            onFocus({ object: BODY_TYPES.PLAYER });
                            /* this breaks the target system
                                as it deselect the plotted target
                            select({ object: BODY_TYPES.PLAYER });
                            */
                        }}
                    >
                        Ship
                </Button>
                </div>
            </div>
            <div className={`Bodies-List${bodiesCount > 6 ? ' List-overflowing' : ''}`}>
                {system.stars.map((s, i) => (
                    <Row
                        key={`star_${i}`}
                        {...s}
                        body={BODY_TYPES.STAR}
                        showInfo={select}
                        isSelected={selectedId === `${BODY_TYPES.STAR}${i}`}
                        isLocked={route.isLocked}
                    />
                ))}
                {system.planets.map((p, i) => (
                    <Row
                        key={`planet_${i}`}
                        {...p}
                        body={BODY_TYPES.PLANET}
                        showInfo={select}
                        isSelected={selectedId === `${BODY_TYPES.PLANET}${i}`}
                        isLocked={route.isLocked}
                    />
                ))}
            </div>
        </>
    );
};

export default Bodies;