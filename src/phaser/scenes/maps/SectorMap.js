import Phaser from "phaser";
import { CELL_SIZE, CELL_NUMBERS } from "enums/sectorMap";
import { coordsToSector } from "libs/game/sector";
import sceneHelper from "phaser/helpers/sceneHelper";
class SectorMap extends Phaser.Scene {
    constructor() {
        super({ key: "SectorMap", active: true });
        this.state = {
            cell: {
                clicked: null,
                selected: false
            }
        };
    }

    create() {
        sceneHelper.setBackground(this);
        this.text = this.add.text(400, 400, "Sector MAP");

        this.addGrid();
        this.input.on('pointerdown', ({ worldX: x, worldY: y }) => {
            if (!sceneHelper.isOnTop(this) || this.route) return;

            const clickedSector = coordsToSector(x, y);
            this.state.cell.selected = this.state.cell.clicked === clickedSector.id;
            this.state.cell.clicked = clickedSector.id;
            console.log(`[Sector Click]`, { x, y, clickedId: clickedSector.id });
            this.text.text = `{ ${clickedSector.il} , ${clickedSector.jl} }`;
            this.text.setColor(this.state.cell.selected ? '#00ff00' : '#ffffff');
        });
    }

    addGrid() {
        const { centerX: x, centerY: y } = this.cameras.main;
        this.grid = this.add.grid(
            x, y,
            CELL_SIZE * CELL_NUMBERS,
            CELL_SIZE * CELL_NUMBERS,
            CELL_SIZE, CELL_SIZE,
            0xffffff, 0, 0xffffff, 0.3
        );
    }
}

export default SectorMap;