import Phaser from "phaser";
import eventBridge, { EVENTS } from "libs/eventBridge";
import ACTIONS from "store/actions";
import { CELL_SIZE, CELL_NUMBERS, CELL_MAP } from "enums/sectorMap";
import { coordsToSector } from "libs/game/mapGrid";
import sceneHelper from "phaser/helpers/sceneHelper";
import { Asteroid } from "phaser/entities/sector";

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
            title: null,
            buttons: []
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

        // Testing bodies
        const asteroid = new Asteroid(this, { x, y });
        //const asteroid1 = new Asteroid(this, { x, y, scale: .5 });
        //const asteroid2 = new Asteroid(this, { x, y, scale: 1.5 });
        //const asteroid3 = new Asteroid(this, { x, y, scale: 2 });
        const asteroid4 = new Asteroid(this, { x: x - 60, y: y - 60, scale: 5, fill: true });
        const asteroid5 = new Asteroid(this, { x: x + 100, y: y + 100, scale: 10, seed: 'manzomma' });
        //


        this.addGrid();
        this.addSector();
        this.input.on('pointerdown', ({ worldX: x, worldY: y }) => {
            // TODO: also skip if Sector is zoomed
            if (!sceneHelper.isOnTop(this) || this.route) return;

            if (this.grid.isActive) {
                const clickedSector = coordsToSector(x, y);
                this.reportClickedSector({ x, y, clickedSector });
                return;
            }
        });

        this.eventsSubscribe();
    }

    eventsSubscribe() {
        eventBridge.on(EVENTS.GAME.MAPS.SECTOR.SET, payload => {
            console.log('[PHASER] sector setup', { payload });
            this.setUpSector();
        });
    }

    setUpSector() {

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
            eventBridge.dispatchFromPhaser(
                ACTIONS.MAPS.SECTOR.SELECT,
                { selected: clickedSector }
            );
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
        const { x } = this.sceneCenter;
        const sectorTitle = this.add.text(x - 40, 10, "", getTextProps({ font: '25px monospace' }));
        sectorTitle.setVisible(false);
        this.sector.title = sectorTitle;

        const backBtn = this.add.text(x - 450, 10, "< Back", getTextProps({ font: '20px monospace' }));
        backBtn.setInteractive().on('pointerdown', (_1, _2, _3, event) => {
            event.stopPropagation();
            this.toggleSector();
        });
        backBtn.disableInteractive();
        backBtn.setVisible(false);
        this.sector.buttons.push(backBtn);

    }

    toggleSector({ il, jl } = {}) {
        this.toggleGrid();
        const newValue = !this.sector.isActive;
        this.sector.isActive = newValue;
        this.sector.title.text = `{ ${il} , ${jl} }`;
        this.sector.title.setVisible(newValue);

        this.sector.buttons.forEach(b => {
            b.setVisible(newValue);
            newValue ? b.setInteractive() : b.disableInteractive();
        });


        // emit unsetSector
        if (!newValue) eventBridge.dispatchFromPhaser(
            ACTIONS.MAPS.SECTOR.SELECT,
            { selected: null }
        );

        //reset grid
        this.state.cell.clicked = null;
        this.state.cell.selected = false;
    }
}

export default SectorMap;