import Phaser from "phaser";
import sceneHelper from "phaser/helpers/sceneHelper";

class SystemMap extends Phaser.Scene {
    constructor() {
        super({ key: "SystemMap", active: true });
    }
    create() {
        sceneHelper.setBackground(this);
        const { x, y } = sceneHelper.getCenter(this);
        this.add.text(x, y, "SYSTEM MAP").setOrigin(.5);
    }
}

export default SystemMap;