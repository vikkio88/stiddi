import Phaser from "phaser";

class Ship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "ship", 0);
        scene.add.existing(this);
    }
}


export default Ship;