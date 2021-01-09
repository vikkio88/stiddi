import Phaser from "phaser";
import { Geom } from "libs/math";
import SystemObject from "./SystemObject";

class Planet extends SystemObject {
    add({ offset, type, radius, colour, id, angle = 0 }) {
        this.info.body = 'planet';
        this.setId(id);
        this.setType(type);

        const { cx, cy } = this.getSceneCenter();

        const orbitShape = new Phaser.Geom.Circle(cx, cy, offset);
        const orbit = this.scene.add.graphics();
        orbit.lineStyle(1, 0xffffff, .5);
        orbit.strokeCircleShape(orbitShape);

        const { x, y } = Geom.pointOnCircumference({ cx, cy }, offset, angle);
        const planetShape = new Phaser.Geom.Circle(x, y, radius);
        const planet = this.scene.add.graphics();
        planet.fillStyle(colour, 2);
        planet.fillCircleShape(planetShape);

        planet.setInteractive(planetShape, Phaser.Geom.Circle.Contains);
        planet.on("pointerdown", () => {
            console.log(`clicked planet ${id}`, this.getInfo());
            this.scene.cameras.main.centerOn(planetShape.x, planetShape.y);
        });

        this.shape = planetShape;
        this.objects.push(planet);
        this.objects.push(orbit);
    }
}

export default Planet;