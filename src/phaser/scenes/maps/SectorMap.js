import Phaser from "phaser";
import { CELL_SIZE, CELL_NUMBERS, CELL_MAP } from "enums/sectorMap";
import { coordsToSector } from "libs/game/mapGrid";
import sceneHelper from "phaser/helpers/sceneHelper";

const getTextProps = (props = {}) => ({
    font: '15px monospace',
    fill: '#fff',
    align: 'center',
    fontStyle: 'strong',
    strokeThickness: 2,
    stroke: '#000',
    ...props
});
class SectorMap extends Phaser.Scene {
    constructor() {
        super({ key: "SectorMap", active: true });
        this.grid = {
            grid: null,
            isActive: true,
            labels: [],
            floatText: null,
        };

        this.sector = {
            objects: [],
            isActive: false,
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
        const { centerX: x, centerY: y } = this.cameras.main;
        this.sceneCenter = { x, y };
        this.addGrid();
        this.addSector();
        this.input.on('pointerdown', ({ worldX: x, worldY: y }) => {
            // TODO: also skip if Sector is zoomed
            if (!sceneHelper.isOnTop(this) || this.route) return;

            const clickedSector = coordsToSector(x, y);
            if (this.grid.isActive) {
                this.reportClickedSector({ x, y, clickedSector });
            } else {
                // at the moment toggling sector
                this.toggleSector();
            }
        });
    }

    addGrid() {
        const { x, y } = this.sceneCenter;
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
        this.state.cell.clicked = clickedSector.id;
        this.state.cell.selected = isSelected;
        // dont report if selected
        if (isSelected) {
            this.toggleSector(clickedSector);
            return;
        }

        if (this.grid.floatText) this.grid.floatText.destroy();
        this.grid.floatText = this.add.text(
            x - 50, y - 30,
            `{ ${clickedSector.il} , ${clickedSector.jl} }`,
            getTextProps()
        );
        this.tweens.add({
            targets: this.grid.floatText,
            x: this.grid.floatText.x,
            y: this.grid.floatText.y - 30,
            alpha: { from: 1, to: .3 },
            duration: 1600,
            ease: 'circular.easeInOut',
            onComplete: () => Boolean(this.grid.floatText) && this.grid.floatText.destroy(),
            loop: false,
        });

    }

    toggleGrid() {
        const newValue = !this.grid.isActive;
        this.grid.isActive = newValue;
        if (this.grid.floatText) this.grid.floatText.destroy();
        this.grid.floatText = null;
        this.grid.grid.setVisible(newValue);
        this.grid.labels.forEach(l => l.setVisible(newValue));
    }

    addSector() {
        // Add objects to the sector
        const { x, y } = this.sceneCenter;
        const sectorTitle = this.add.text(x - 20, 10, "", getTextProps({ font: '25px monospace' }));
        sectorTitle.setVisible(false);
        this.sector.title = sectorTitle;
    }

    toggleSector({ il, jl } = {}) {
        this.toggleGrid();
        const newValue = !this.sector.isActive;
        this.sector.isActive = newValue;
        this.sector.title.text = `{ ${il} , ${jl} }`;
        this.sector.title.setVisible(newValue);
    }
}

export default SectorMap;