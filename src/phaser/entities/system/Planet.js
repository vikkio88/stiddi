import Phaser from "phaser";
import { Geom, Coords } from "libs/math";
import SystemObject from "./SystemObject";
import eventBridge from "libs/eventBridge";
import { BODY_TYPES } from "enums/systemMap";

class Planet extends SystemObject {
    add({ offset, name, type, radius, colour, id, index, angle = 0 }) {
        // maybe body can be a enum
        this.setInfo({ id, name, type, body: 'planet', index, offset, radius });
        const { cx, cy } = this.getSceneCenter();

        const { x, y } = Geom.pointOnCircumference({ cx, cy }, offset, angle);
        const orbitOffset = Phaser.Math.Distance.Between(x, y, cx, cy);
        const orbitShape = new Phaser.Geom.Circle(cx, cy, orbitOffset);
        const orbit = this.scene.add.graphics();
        orbit.lineStyle(1, 0xffffff, .3);
        orbit.strokeCircleShape(orbitShape);

        const planetShape = new Phaser.Geom.Circle(x, y, radius);
        const planet = this.scene.add.graphics();
        planet.fillStyle(colour, 2);
        planet.fillCircleShape(planetShape);

        planet.setInteractive(planetShape, Phaser.Geom.Circle.Contains);
        planet.on("pointerdown", (pointer, x, y, event) => {
            event.stopPropagation();
            const position = Coords.relativeCoords(
                this.getPosition(),
                Coords.zerify(
                    Coords.make(cx, cy)
                )
            );
            eventBridge.dispatchFromPhaser(
                'player:targetSystem',
                { target: { object: BODY_TYPES.PLANET, index, position } }
            );


            // move the timeout to a function given difference
            this.scene.cameras.main.pan(planetShape.x, planetShape.y, 1500);
        });

        this.shape = planetShape;
        this.objects.push(planet);
        this.objects.push(orbit);
    }
}

export default Planet;