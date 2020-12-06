import eBridge, { EVENTS } from 'libs/eventBridge';
const burn = () => {
  eBridge.emit(EVENTS.GAME.ACTIONS.BURN);
};

const rotate = direction => {
  eBridge.emit(EVENTS.GAME.ACTIONS.ROTATE, { direction });
};


function App() {
  return (
    <>
      <button onClick={() => rotate(-1)}>Rotate Left</button>
      <button onClick={burn}>Burn</button>
      <button onClick={() => rotate(1)}>Rotate Right</button>
    </>
  );
}

export default App;
