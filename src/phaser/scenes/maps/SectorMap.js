import Phaser from "phaser";
import eventBridge, { EVENTS } from "libs/eventBridge";
import ACTIONS from "store/actions";
import { CELL_SIZE, CELL_NUMBERS, CELL_MAP } from "enums/sectorMap";
import { coordsToSector } from "libs/game/mapGrid";
import sceneHelper from "phaser/helpers/sceneHelper";
import { Asteroid } from "phaser/entities/sector";
//import { Asteroid } from "phaser/entities/sector";

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
        this.ship = null;

        this.grid = {
            grid: null,
            isActive: true,
            labels: [],
            floatText: null,
            objects: []
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
            },
            // the setup of the
            // sector, coming from storeon
            sector: {}
        };
    }

    create() {
        sceneHelper.setBackground(this);
        const { centerX: x, centerY: y } = this.cameras.main;
        this.sceneCenter = { x, y };

        // Testing bodies
        //const asteroid1 = new Asteroid(this, { x, y, scale: .5 });
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
            this.setUpSector(payload);
        });
    }

    setUpSector({ position, sector }) {
        //position is player position

        this.state.sector = sector;
        // need to check whether can 
        // avoid sending SETUP
        // if grid is active
        if (!this.grid.isActive || !Boolean(sector) || !Boolean(sector.objects)) return;

        const secObjs = sector.objects;
        for (let i = 0; i <= CELL_NUMBERS; i++) {
            for (let j = 0; j <= CELL_NUMBERS; j++) {
                if (secObjs[i] && Array.isArray(secObjs[i][j])) {
                    secObjs[i][j].forEach(o => {
                        const { pos: { x, y } } = o;
                        // this could be any object type
                        // testing only asteroids for now
                        const obj = new Asteroid(this, {
                            seed: `${sector.id}_${x}_${y}_${i}_${j}`,
                            x: (i * CELL_SIZE) + x,
                            y: (j * CELL_SIZE) + y,
                            fill: false,
                            scale: .5,
                        });
                        this.grid.objects.push(obj);
                    });
                }
            }
        }

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
                this.add.text(10, rowOffset + (CELL_SIZE / 2), CELL_MAP[i], getTextProps({ fill: '#00ff00' }))
            );
        }

        for (let j = 0; j < CELL_NUMBERS; j++) {
            this.grid.labels.push(
                this.add.text((CELL_SIZE * j) + (CELL_SIZE / 2), 10, `${j + 1}`, getTextProps({ fill: '#00ff00' }))
            );
        }
    }

    reportClickedSector({ x, y, clickedSector } = {}) {
        //console.log(`[Sector Click]`, { x, y, clickedId: clickedSector.id });
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
        //debug pos
        const isThere = this.state.sector.objects[clickedSector.i][clickedSector.j].length > 0;
        const p = isThere ? this.state.sector.objects[clickedSector.i][clickedSector.j][0].pos : false;
        console.log('ON CURRENT CLICKED', { id: clickedSector.id, isThere });

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
        this.grid.objects.forEach(o => o.setVisible(newValue));
    }

    addSector() {
        // Add objects to the sector
        const { x } = this.sceneCenter;
        const sectorTitle = this.add.text(x - 40, 10, "", getTextProps({ font: '25px monospace' }));
        sectorTitle.setVisible(false);
        this.sector.title = sectorTitle;

        const backBtn = this.add.text(x - /*450*/ 200, 10, "< Back", getTextProps({ font: '20px monospace' }));
        backBtn.setInteractive().on('pointerdown', (_1, _2, _3, event) => {
            event.stopPropagation();
            this.toggleSector();
        });
        backBtn.disableInteractive();
        backBtn.setVisible(false);
        this.sector.buttons.push(backBtn);

    }

    toggleSector({ il, jl, i, j } = {}) {
        this.toggleGrid();
        const newValue = !this.sector.isActive;
        this.sector.isActive = newValue;
        this.sector.title.text = `{ ${il} , ${jl} }`;
        this.sector.title.setVisible(newValue);

        this.sector.buttons.forEach(b => {
            b.setVisible(newValue);
            newValue ? b.setInteractive() : b.disableInteractive();
        });

        // Draw things that zoomed on this sector
        if (newValue
            && this.state.sector.objects
            && this.state.sector.objects[i]
            && Array.isArray(this.state.sector.objects[i][j])
        ) {
            this.state.sector.objects[i][j].forEach(o => {
                const { pos: { x, y } } = o;
                console.log(`asteroid in sector {${i} , ${j}}`, { x, y });
                const obj = new Asteroid(this, {
                    seed: `${this.state.sector.id}_${x}_${y}_${i}_${j}`,
                    x: x * CELL_NUMBERS,//- (i / CELL_SIZE),
                    y: y * CELL_NUMBERS, //- (j / CELL_SIZE),
                    fill: true,
                    scale: 2,
                });
                this.sector.objects.push(obj);
            });
        }

        if (!newValue) {
            this.sector.objects.forEach(o => o.destroy());
            // emit unsetSector
            eventBridge.dispatchFromPhaser(
                ACTIONS.MAPS.SECTOR.SELECT,
                { selected: null }
            );
        }

        //reset grid
        this.state.cell.clicked = null;
        this.state.cell.selected = false;
    }
}

export default SectorMap;