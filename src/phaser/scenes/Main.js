
import Phaser from "phaser";
import { Player } from "../entities";

class Main extends Phaser.Scene {
    constructor() {
        super({ key: "Main" });
    }

    create() {
        this.player = new Player(this, this.cameras.main.centerX, this.cameras.main.centerY);
    }
}

export default Main;