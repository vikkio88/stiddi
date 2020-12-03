import React from 'react';
import ReactDOM from 'react-dom';
import initEBridge from './ebridge';
import eventBridge, { EVENTS } from 'libs/eventBridge';

import './phaser';

import './index.css';
import App from './App';

initEBridge();

eventBridge.on(EVENTS.PHASER.READY, () => {
  console.log("phaser ready received");
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('ui')
);
