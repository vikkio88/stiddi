import Phaser from "phaser";
import eventBridge, { EVENTS } from "libs/eventBridge";
import ACTIONS from "store/actions";
import { CELL_SIZE, CELL_NUMBERS, CELL_MAP } from "enums/sectorMap";
import { coordsToSector } from "libs/game/mapGrid";
import sceneHelper from "phaser/helpers/sceneHelper";
import { Asteroid } from "phaser/entities/sector";
// maybe move to sector one too?
import Ship from "phaser/entities/system/Ship";

// might move this to 1000
const SECTOR_SCALE = 100;

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
            objects: [],
            player: null
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
        this.input.on('pointerdown', ({ worldX: x, worldY: y }) => {
            // TODO: also skip if Sector is zoomed
            if (!sceneHelper.isOnTop(this)) return;

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

        eventBridge.on(EVENTS.GAME.MAPS.SECTOR.UPDATE_PLAYER, payload => {
            if (!sceneHelper.isOnTop(this)) return;
            console.log('[PHASER] update player sector', { payload });
            this.addPlayer(payload);
        });
    }

    setUpSector({ player, sector }) {
        //position is player position
        this.addPlayer(player);
        this.state.sector = sector;
        // need to check whether can 
        // avoid sending SETUP
        // if grid is active
        if (!this.grid.isActive || !Boolean(sector) || !Boolean(sector.objects)) return;

        const secObjs = sector.objects;
        secObjs.forEach(o => {
            const { pos: { x, y } } = o;
            // this could be any object type
            // testing only asteroids for now
            const obj = new Asteroid(this, {
                seed: `${sector.id}_${x}_${y}`,
                x: this.sceneCenter.x + x,
                y: this.sceneCenter.y + y,
                fill: false,
                scale: .5,
            });
            this.grid.objects.push(obj);
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
        console.log(`[Sector Click]`, { x, y, clickedId: clickedSector.id });
        const isSelected = this.state.cell.clicked === clickedSector.id;
        this.state.cell.clicked = clickedSector.id;
        this.state.cell.selected = isSelected;
        // dont report if selected
        if (isSelected) {
            /*
            MAYBE WANT TO ZOOMIN THERE?
            */
            eventBridge.dispatchFromPhaser(
                ACTIONS.MAPS.SECTOR.SELECT,
                { selected: null }
            );
            return;
        }
        //debug pos
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

    addPlayer({ position, direction }) {
        if (this.grid.player) this.grid.player.destroy();
        const { x: cx, y: cy } = this.sceneCenter;
        const { x, y } = position;
        const xt = cx + (x / SECTOR_SCALE);
        const yt = cy + (y / SECTOR_SCALE);
        this.grid.player = new Ship(this, xt, yt);
        if (direction) this.grid.player.setAngle(direction);
    }
}

export default SectorMap;