import Phaser from "phaser";
import eventBridge, { EVENTS } from "libs/eventBridge";
import sceneHelper from "phaser/helpers/sceneHelper";
import { Planet, Star } from "phaser/entities/system";

class SystemMap extends Phaser.Scene {
    constructor() {
        super({ key: "SystemMap", active: true });
        this.objects = {
            stars: [],
            planets: [],
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
        });


        eventBridge.on(EVENTS.GAME.MAPS.ZOOM_SYSTEM, payload => {
            console.log('[phaser] ZOOM', { payload, zoom: this.cameras.main.zoom });
            if (payload.reset) {
                this.cameras.main.setZoom(1);
                return;
            }
            this.cameras.main.setZoom(this.cameras.main.zoom + ((payload.out ? -1 : 1) / 10));
        });


        eventBridge.on(EVENTS.GAME.MAPS.CLEAR_SYSTEM, payload => {
            console.log('[phaser] CLEAR SYSTEM', { payload });

            this.cameras.main.setZoom(1);
            this.clear();
        });

        eventBridge.on(EVENTS.GAME.MAPS.FOCUS_SYSTEM, payload => {
            console.log('[phaser] FOCUS SYSTEM', { payload });
            const focusing = this.objects[payload.object][payload.index];
            const { x, y } = focusing.getPosition();
            this.cameras.main.centerOn(x, y);

        });
    }

    addStar({ id, radius, colour }) {
        const star = new Star(this);
        star.add({ id, radius, colour });
        this.objects.stars.push(star);
    }

    addPlanet({ id, radius, colour, offset }) {
        const planet = new Planet(this);
        planet.add({ id, radius, colour, offset });
        this.objects.planets.push(planet);
    }

    clear() {
        this.objects.stars.forEach(s => s.destroy());
        this.objects.planets.forEach(p => p.destroy());
    }

    create() {
        sceneHelper.setBackground(this);
        const { x, y } = sceneHelper.getCenter(this);
        const text = this.add.text(x, y - 100, "SYSTEM MAP").setOrigin(.5);
        this.eventsSubscribe();
    }
}

export default SystemMap;