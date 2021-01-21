import Phaser from "phaser";

class TipCross extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "tipCross", 0);
        scene.add.existing(this);
        this.setScale(.5);
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y
        };
    }
}


export default TipCross;