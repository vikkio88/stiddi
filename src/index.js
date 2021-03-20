import React from "react";
import ReactDOM from "react-dom";
import { StoreContext } from "storeon/react";
import initEBridge from "./ebridge";
import eventBridge, { EVENTS } from "libs/eventBridge";
import ACTIONS from "./store/actions";
import store from "./store";

import phaserInit from "./phaser";

import "./index.css";
import Main from "./Main";
import { SCENES } from "enums/ui";

const clickDisabler = e => {
  e.stopPropagation();
  e.preventDefault();
};
document.addEventListener("click", clickDisabler, true);


initEBridge();
phaserInit();


eventBridge.on(EVENTS.PHASER.READY, () => {
  console.log("PHASER:Ready");
  eventBridge.emit(EVENTS.PHASER.SET_SCENE, { scene: SCENES.NAVIGATION });
  document.removeEventListener("click", clickDisabler, true);
});

// maybe no need to be single event? move it to Event one
eventBridge.on(EVENTS.PHASER.HEARTBEAT, payload => {
  store.dispatch(ACTIONS.NAV.HB, payload);
});

eventBridge.on(EVENTS.PHASER.EVENT, ({ type, payload }) => {
  console.log("bridge event received", { type, payload });
  store.dispatch(type, payload);
});

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <Main />
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById("ui")
);
