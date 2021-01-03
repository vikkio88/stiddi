import Phaser from "phaser";

class SystemMap extends Phaser.Scene {
    constructor() {
        super({ key: "SystemMap" });
    }

    create() {
        this.add.text(400, 400, "SYSTEM MAP");
    }
}

export default SystemMap;