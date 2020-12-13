import eBridge, { EVENTS } from 'libs/eventBridge';
const burn = () => {
  eBridge.emit(EVENTS.GAME.ACTIONS.BURN, { timeout: 2000 });
};

const rotate = direction => {
  eBridge.emit(EVENTS.GAME.ACTIONS.ROTATE, { direction });
};

const fullStop = () => {
  eBridge.emit(EVENTS.GAME.ACTIONS.FULL_STOP);
};


function App() {
  return (
    <>
      <button onClick={() => rotate(-1)}>Rotate Left</button>
      <button onClick={burn}>Burn 2 sec</button>
      <button onClick={() => rotate(1)}>Rotate Right</button>
      <button onClick={fullStop}>Full Stop</button>
    </>
  );
}

export default App;
