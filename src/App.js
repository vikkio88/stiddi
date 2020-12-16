import eBridge, { EVENTS } from 'libs/eventBridge';
const burn = () => {
  eBridge.emit(EVENTS.GAME.ACTIONS.BURN, { timeout: 2000 });
};

const rotate = angle => {
  eBridge.emit(EVENTS.GAME.ACTIONS.ROTATE, { angle });
};

const fullStop = () => {
  eBridge.emit(EVENTS.GAME.ACTIONS.FULL_STOP);
};


function App() {
  return (
    <>
      <button onClick={() => rotate(180)}>Rotate 180</button>
      <button onClick={burn}>Burn 2 sec</button>
      <button onClick={() => rotate(90)}>Rotate 90</button>
      <button onClick={fullStop}>Full Stop</button>
    </>
  );
}

export default App;
