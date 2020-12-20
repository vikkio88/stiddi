import React from 'react';
import ReactDOM from 'react-dom';
import { StoreContext } from "storeon/react";
import initEBridge from './ebridge';
import eventBridge, { EVENTS } from 'libs/eventBridge';
import store from './store';

import './phaser';

import './index.css';
import Main from './Main';

initEBridge();

eventBridge.on(EVENTS.PHASER.READY, () => {
  console.log("phaser ready received");
});

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <Main />
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById('ui')
);
