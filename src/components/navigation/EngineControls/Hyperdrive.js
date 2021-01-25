const Hyperdrive = ({ lock, settings, position, dispatch, route }) => {
    const {} = settings;
    const targetPos = route.target.position;
    // this also has orbiting:bool
    const playerPos = position.system;
    console.log('POSITIONS', targetPos, playerPos);
    return (
        <>
            <h3>ROUTE LOCKED</h3>
        </>
    );
};

export default Hyperdrive;