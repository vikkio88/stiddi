import Phaser from "phaser";
import sceneHelper from "phaser/helpers/sceneHelper";

class GalaxyMap extends Phaser.Scene {
    constructor() {
        super({ key: "GalaxyMap", active: true });
    }

    create() {
        sceneHelper.setBackground(this);
        this.add.text(400, 400, "GALAXY MAP");
    }
}

export default GalaxyMap;