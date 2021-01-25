import { Geom } from "libs/math";

const Hyperdrive = ({ lock, settings, position, dispatch, route }) => {
    //const { } = settings;
    const targetPos = route.target.position;
    // this also has orbiting:bool
    const playerPos = position.system;
    return (
        <>
            <h3>ROUTE LOCKED</h3>
            <h2>Player: ( {playerPos.x} , {playerPos.y})</h2>
            <h2>Target: ( {targetPos.x} , {targetPos.y})</h2>
            <h1>DIRECTION: {Geom.angleBetween(playerPos, targetPos)}</h1>
        </>
    );
};

export default Hyperdrive;