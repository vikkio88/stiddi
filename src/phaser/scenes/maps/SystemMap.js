import Phaser from "phaser";
import { randomizer } from "libs/random";
import { Geom } from "libs/math";
import eventBridge, { EVENTS } from "libs/eventBridge";
import sceneHelper from "phaser/helpers/sceneHelper";

class SystemMap extends Phaser.Scene {
    constructor() {
        super({ key: "SystemMap", active: true });
        this.objects = {
            stars: [],
            planets: [],
            orbits: []
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

    addStar({ id, radius, colour }) {
        const { x, y } = this.getCenter();
        const starShape = new Phaser.Geom.Circle(x, y, radius);
        const star = this.add.graphics();
        star.fillStyle(colour, 2);
        star.fillCircleShape(starShape);

        star.setInteractive(starShape, Phaser.Geom.Circle.Contains);

        star.on("pointerdown", () => {
            console.log(`clicked on star ${id}`);
            this.cameras.main.centerOn(starShape.x, starShape.y);
        });

        this.objects.stars.push(star);
    }

    addPlanet({ id, radius, colour, offset }) {
        const { x: cx, y: cy } = this.getCenter();


        const orbitShape = new Phaser.Geom.Circle(cx, cy, offset);
        const orbit = this.add.graphics();
        orbit.lineStyle(1, 0xffffff, .5);
        orbit.strokeCircleShape(orbitShape);

        const angle = randomizer.int(0, 360);
        const { x, y } = Geom.pointOnCircumference({ cx, cy }, offset, angle);
        const planetShape = new Phaser.Geom.Circle(x, y, radius);
        const planet = this.add.graphics();
        planet.fillStyle(colour, 2);
        planet.fillCircleShape(planetShape);

        planet.setInteractive(planetShape, Phaser.Geom.Circle.Contains);
        planet.on("pointerdown", () => {
            console.log(`clicked planet ${id}`);
            this.cameras.main.centerOn(planetShape.x, planetShape.y);
        });

        this.objects.planets.push(planet);
        this.objects.orbits.push(orbit);
    }

    clear() {
        this.objects.stars.forEach(s => s.destroy());
        this.objects.planets.forEach(p => p.destroy());
        this.objects.orbits.forEach(o => o.destroy());
    }

    create() {
        sceneHelper.setBackground(this);
        const { x, y } = sceneHelper.getCenter(this);
        const text = this.add.text(x, y - 100, "SYSTEM MAP").setOrigin(.5);
        text.setInteractive();
        text.on("pointerdown", () => console.log("clicked text"));
        this.eventsSubscribe();
    }
}

export default SystemMap;