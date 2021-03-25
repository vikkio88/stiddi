import Phaser from "phaser";
import { CELL_SIZE, CELL_NUMBERS, CELL_MAP } from "enums/sectorMap";
import { coordsToSector } from "libs/game/sector";
import sceneHelper from "phaser/helpers/sceneHelper";
class SectorMap extends Phaser.Scene {
    constructor() {
        super({ key: "SectorMap", active: true });
        this.grid = {
            grid: null,
            labels: []
        };
        this.state = {
            cell: {
                clicked: null,
                selected: false
            }
        };
    }

    create() {
        sceneHelper.setBackground(this);

        this.addGrid();
        this.input.on('pointerdown', ({ worldX: x, worldY: y }) => {
            if (!sceneHelper.isOnTop(this) || this.route) return;

            const clickedSector = coordsToSector(x, y);
            this.reportClickedSector({ x, y, clickedSector });
        });
    }

    addGrid() {
        const { centerX: x, centerY: y } = this.cameras.main;
        this.grid.grid = this.add.grid(
            x, y,
            CELL_SIZE * CELL_NUMBERS,
            CELL_SIZE * CELL_NUMBERS,
            CELL_SIZE, CELL_SIZE,
            0xffffff, 0, 0xffffff, 0.3
        );

        for (let i in CELL_MAP) {
            const rowOffset = (i * CELL_SIZE);
            this.grid.labels.push(
                this.add.text(10, rowOffset + (CELL_SIZE / 2), CELL_MAP[i])
            );
        }

        for (let j = 0; j < CELL_NUMBERS; j++) {
            this.grid.labels.push(
                this.add.text((CELL_SIZE * j) + (CELL_SIZE / 2), 10, `${j + 1}`)
            );
        }
    }

    reportClickedSector({ x, y, clickedSector } = {}) {
        console.log(`[Sector Click]`, { x, y, clickedId: clickedSector.id });
        const isSelected = this.state.cell.clicked === clickedSector.id;
        // dont report twice if it was selected
        if (this.state.cell.selected && isSelected) return;

        this.state.cell.clicked = clickedSector.id;
        this.state.cell.selected = isSelected;
        const fill = isSelected ? '#00ff00' : '#fff';
        const stroke = isSelected ? '#fff' : '#000';
        const text = this.add.text(
            x - 50, y - 30,
            `{ ${clickedSector.il} , ${clickedSector.jl} }`,
            {
                font: '15px monospace',
                fill, align: 'center',
                fontStyle: 'strong',
                strokeThickness: 2,
                stroke
            }
        );
        this.tweens.add({
            targets: text,
            x: text.x, y: text.y - 30,
            alpha: { from: 1, to: .3 },
            duration: 1600,
            ease: 'circular.easeInOut',
            onComplete: () => text.destroy(),
            loop: false,
        });

    }
}

export default SectorMap;