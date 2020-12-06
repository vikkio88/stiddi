import Phaser from "phaser";
export default class extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "player", 0);
        scene.add.existing(this);
        //this.setScale(.5);
    }
}
