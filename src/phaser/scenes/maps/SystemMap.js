import Phaser from "phaser";
import eventBridge, { EVENTS } from "libs/eventBridge";
import sceneHelper from "phaser/helpers/sceneHelper";

class SystemMap extends Phaser.Scene {
    constructor() {
        super({ key: "SystemMap", active: true });
        this.objects = {
            stars: [],
            planets: []
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

            this.cameras.main.setZoom(this.cameras.main.zoom + ((payload.out ? -1 : 1) / 10));
        });


        eventBridge.on(EVENTS.GAME.MAPS.CLEAR_SYSTEM, payload => {
            console.log('[phaser] CLEAR SYSTEM', { payload });

            this.cameras.main.setZoom(1);
            this.clear();
        });
    }

    addStar({ radius, colour }) {
        const { x, y } = this.getCenter();
        const starShape = new Phaser.Geom.Circle(x, y, radius);
        const star = this.add.graphics();
        star.fillStyle(colour, 2);
        star.fillCircleShape(starShape);

        this.objects.stars.push(star);
    }

    addPlanet({ radius, colour, offset }) {
        const { x, y } = this.getCenter();
        const planetShape = new Phaser.Geom.Circle(x + offset, y, radius);
        const planet = this.add.graphics();
        planet.fillStyle(colour, 2);
        planet.fillCircleShape(planetShape);

        this.objects.planets.push(planet);
    }

    clear() {
        this.objects.stars.forEach(s => s.destroy());
        this.objects.planets.forEach(p => p.destroy());
    }

    create() {
        sceneHelper.setBackground(this);
        const { x, y } = sceneHelper.getCenter(this);
        this.add.text(x, y - 100, "SYSTEM MAP").setOrigin(.5);
        this.eventsSubscribe();
    }
}

export default SystemMap;