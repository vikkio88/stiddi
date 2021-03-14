import { ZOOM_SCALES } from "enums/systemMap";
import Phaser from "phaser";

class Ship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "ship", 0);
        scene.add.existing(this);
        this.setScale(ZOOM_SCALES.default.ship);
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y
        };
    }
}


export default Ship;