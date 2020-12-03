import eBridge, { EVENTS } from 'libs/eventBridge';
const burn = () => {
  eBridge.emit(EVENTS.GAME.ACTIONS.BURN);
};

function App() {
  return (
    <>
      <button onClick={burn}>Burn</button>
    </>
  );
}

export default App;
