import Phaser from "phaser";

class GalaxyMap extends Phaser.Scene {
    constructor() {
        super({ key: "GalaxyMap" });
    }

    create() {
        this.add.text(400, 400, "GALAXY MAP");
    }
}

export default GalaxyMap;