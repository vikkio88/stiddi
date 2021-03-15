import Phaser from "phaser";
import sceneHelper from "phaser/helpers/sceneHelper";

class SectorMap extends Phaser.Scene {
    constructor() {
        super({ key: "SectorMap",active: true });
    }

    create() {
        sceneHelper.setBackground(this);
        this.add.text(400, 400, "Sector MAP");
    }
}

export default SectorMap;