import React from 'react';
import ReactDOM from 'react-dom';
import { StoreContext } from "storeon/react";
import initEBridge from './ebridge';
import eventBridge, { EVENTS } from 'libs/eventBridge';
import store from './store';

import './phaser';

import 'csshake/dist/csshake.min.css';
import './index.css';
import Main from './Main';

initEBridge();

eventBridge.on(EVENTS.PHASER.READY, () => {
  console.log("phaser ready received");
});

eventBridge.on(EVENTS.PHASER.HEARTBEAT, payload => {
  //console.log('RECEIVED HEARTBEAT', payload);
  store.dispatch('phaser:heartbeat', payload);
});

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <Main />
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById('ui')
);
