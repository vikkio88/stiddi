import Phaser from "phaser";
import eventBridge, { EVENTS } from "libs/eventBridge";


import {
    Boot,
    Navigation,

    // maps
    SystemMap,
    GalaxyMap
} from "./scenes";

const config = {
    parent: "porthole",
    pixelArt: true,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
};

config.type = Phaser.AUTO;
config.scene = [
    Boot, Navigation,

    //maps
    SystemMap, GalaxyMap
];
config.scale = {
    mode: Phaser.Scale.FIT,
    parent: 'porthole',
    autoCenter: Phaser.Scale.FIT,
    width: '100%',
    height: '100%'
};



const phaserInit = () => {
    const game = new Phaser.Game(config);

    eventBridge.on(EVENTS.PHASER.SET_SCENE, payload => {
        game.scene.start(payload.scene);
    });
};

export default phaserInit;