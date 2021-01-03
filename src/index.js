import React from 'react';
import ReactDOM from 'react-dom';
import { StoreContext } from "storeon/react";
import initEBridge from './ebridge';
import eventBridge, { EVENTS } from 'libs/eventBridge';
import store from './store';

import phaserInit from "./phaser";

import 'csshake/dist/csshake.min.css';
import './index.css';
import Main from './Main';

initEBridge();
phaserInit();


eventBridge.on(EVENTS.PHASER.READY, () => {
  console.log("phaser ready received");
  eventBridge.emit(EVENTS.PHASER.SET_SCENE, { scene: "Navigation" });
});

eventBridge.on(EVENTS.PHASER.HEARTBEAT, payload => {
  store.dispatch('phaser:heartbeat', payload);
});

eventBridge.on(EVENTS.PHASER.EVENT, ({ type, payload }) => {
  console.log('bridge event received', { type, payload });
  store.dispatch(type, payload);
});

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <Main />
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById('ui')
);
