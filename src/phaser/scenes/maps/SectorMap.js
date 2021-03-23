import Phaser from "phaser";
import sceneHelper from "phaser/helpers/sceneHelper";

const CELL_SIZE = 150;
const CELL_NUMBERS = 6;
class SectorMap extends Phaser.Scene {
    constructor() {
        super({ key: "SectorMap", active: true });
    }

    create() {
        sceneHelper.setBackground(this);
        this.add.text(400, 400, "Sector MAP");

        this.addGrid();
    }

    addGrid() {
        const { centerX: x, centerY: y } = this.cameras.main;
        this.grid = this.add.grid(
            x, y,
            CELL_SIZE * CELL_NUMBERS ,
            CELL_SIZE * CELL_NUMBERS,
            CELL_SIZE, CELL_SIZE,
            0xffffff, 0, 0xffffff, 0.3
        );
    }
}

export default SectorMap;