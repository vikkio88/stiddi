import Phaser from "phaser";
import eventBridge, { EVENTS } from "libs/eventBridge";
import sceneHelper from "phaser/helpers/sceneHelper";
import { Planet, Star } from "phaser/entities/system";
import Ship from "phaser/entities/system/Ship";

class SystemMap extends Phaser.Scene {
    constructor() {
        super({ key: "SystemMap", active: true });
        this.objects = {
            stars: [],
            planets: [],
            player: null
        };
    }

    getCenter() {
        return sceneHelper.getCenter(this);
    }

    eventsSubscribe() {
        eventBridge.on(EVENTS.GAME.MAPS.DRAW_SYSTEM, payload => {
            console.log('[phaser] DRAW SYSTEM', payload);

            payload.system.stars.forEach(s => this.addStar(s));
            payload.system.planets.forEach(p => this.addPlanet(p));
            this.addPlayer(payload.player);
        });


        eventBridge.on(EVENTS.GAME.MAPS.ZOOM_SYSTEM, payload => {
            console.log('[phaser] ZOOM', { payload, zoom: this.cameras.main.zoom });
            if (payload.reset) {
                this.cameras.main.setZoom(1);
                return;
            }

            if (payload.level) {
                this.cameras.main.zoomTo(payload.level, 1500);
                return;
            }

            this.cameras.main.zoomTo(this.cameras.main.zoom + ((payload.out ? -1 : 1) / 10), 500);
        });


        eventBridge.on(EVENTS.GAME.MAPS.CLEAR_SYSTEM, payload => {
            console.log('[phaser] CLEAR SYSTEM', { payload });

            this.cameras.main.setZoom(1);
            this.clear();
        });

        eventBridge.on(EVENTS.GAME.MAPS.FOCUS_SYSTEM, payload => {
            console.log('[phaser] FOCUS SYSTEM', { payload });

            if (payload.object === 'player') {
                const { x, y } = this.objects.player.getPosition();
                this.cameras.main.centerOn(x, y);
                return;
            }

            const focusing = this.objects[payload.object][payload.index];
            const { x, y } = focusing.getPosition();
            this.cameras.main.centerOn(x, y);
        });
    }

    addPlayer(params) {
        const { x, y } = params;
        const { x: cx, y: cy } = this.getCenter();
        this.objects.player = new Ship(this, cx + x, cy + y);
    }

    addStar(params) {
        const star = new Star(this);
        star.add(params);
        this.objects.stars.push(star);
    }

    addPlanet(params) {
        const planet = new Planet(this);
        planet.add(params);
        this.objects.planets.push(planet);
    }

    clear() {
        this.objects.stars.forEach(s => s.destroy());
        this.objects.planets.forEach(p => p.destroy());
        if (this.objects.player) {
            this.objects.player.destroy();
        }
    }

    create() {
        sceneHelper.setBackground(this);
        const { x, y } = sceneHelper.getCenter(this);
        this.add.text(x, y - 100, "SYSTEM MAP").setOrigin(.5);
        this.eventsSubscribe();
        this.input.on('pointerdown', ({ worldX: x, worldY: y }) => console.log(`clicked on map ${x}, ${y}`));
    }
}

export default SystemMap;