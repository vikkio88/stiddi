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
    //maps
    SystemMap, GalaxyMap,

    // boot/preload
    Boot,

    // not active scene
    Navigation,
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
    eventBridge.on(EVENTS.PHASER.SET_SCENE, ({ scene, params }) => {
        game.scene.start(scene, params);
        game.scene.bringToTop(scene);

    });

    eventBridge.on(EVENTS.PHASER.SWAP_SCENE, ({ scene }) => {
        game.scene.bringToTop(scene);
    });
};

export default phaserInit;