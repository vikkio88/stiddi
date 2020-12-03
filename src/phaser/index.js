import Phaser from "phaser";

import {
    Boot,
    Main
} from "./scenes";

const config = {
    parent: "porthole",
    pixelArt: true,
    roundPixels: true
};

config.type = Phaser.AUTO;
config.scene = [Boot, Main];
config.scale = {
    mode: Phaser.Scale.FIT,
    parent: 'porthole',
    autoCenter: Phaser.Scale.FIT,
    width: '100%',
    height: '100%'
};


const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars