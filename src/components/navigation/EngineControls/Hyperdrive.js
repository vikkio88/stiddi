import { Button } from "components/common";
const Hyperdrive = ({ lock, settings, position, dispatch, route }) => {
    //const { } = settings;
    const { target } = route;
    const targetPos = target.position;
    // this also has orbiting:bool
    const playerPos = position.system;

    return (
        <>
            <h3>ROUTE LOCKED</h3>
            <h2>Player: ( {playerPos.x} , {playerPos.y})</h2>
            <h2>Target: ( {targetPos.x} , {targetPos.y})</h2>
            <h1>DIRECTION: {target.angle}</h1>

            <Button
                // disable if direction not in engage angle
                // or speed is < 50m/s
                disabled
                onClick={() => dispatch('navigation:engageHyperdrive')}
                variant={Button.Variants.EMPTY_GREEN}
            >
                ENGAGE
            </Button>
        </>
    );
};

export default Hyperdrive;