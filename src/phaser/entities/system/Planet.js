import Phaser from "phaser";
import { Geom } from "libs/math";
import SystemObject from "./SystemObject";

class Planet extends SystemObject {
    add({ offset, name, type, radius, colour, id, index, angle = 0 }) {
        // maybe body can be a enum
        this.setInfo({ id, name, type, body: 'planet', index, offset, radius });


        const { cx, cy } = this.getSceneCenter();

        const orbitShape = new Phaser.Geom.Circle(cx, cy, offset);
        const orbit = this.scene.add.graphics();
        orbit.lineStyle(1, 0xffffff, .3);
        orbit.strokeCircleShape(orbitShape);

        const { x, y } = Geom.pointOnCircumference({ cx, cy }, offset, angle);
        const planetShape = new Phaser.Geom.Circle(x, y, radius);
        const planet = this.scene.add.graphics();
        planet.fillStyle(colour, 2);
        planet.fillCircleShape(planetShape);

        planet.setInteractive(planetShape, Phaser.Geom.Circle.Contains);
        planet.on("pointerdown", (pointer, x, y, event) => {
            event.stopPropagation();
            console.log(`clicked planet ${id}`, this.getInfo());
            this.scene.cameras.main.centerOn(planetShape.x, planetShape.y);
        });

        this.shape = planetShape;
        this.objects.push(planet);
        this.objects.push(orbit);
    }
}

export default Planet;