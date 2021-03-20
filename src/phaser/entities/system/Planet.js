import Phaser from "phaser";
import ACTIONS from "store/actions";
import { Geom, Coords } from "libs/math";
import SystemObject from "./SystemObject";
import eventBridge from "libs/eventBridge";
import { BODY_TYPES } from "enums/systemMap";
import shapesHelper from "phaser/helpers/shapesHelper";

class Planet extends SystemObject {
    add({ offset, name, type, radius, colour, id, index, angle = 0 }, { cx, cy }) {
        // maybe body can be a enum
        this.setInfo({ id, name, type, body: 'planet', index, offset, radius, colour, center: { cx, cy } });
        const { x, y } = Geom.pointOnCircumference({ cx, cy }, offset, angle);
        const {
            circle: orbit
        } = shapesHelper.drawCircle2Points(this.scene, { cx, cy }, { x, y });

        const {
            shape: planetShape,
            circle: planet
        } = shapesHelper.drawCircle(
            this.scene,
            { x, y, radius, colour }
        );

        planet.setInteractive(planetShape, Phaser.Geom.Circle.Contains);
        planet.on("pointerdown", (pointer, x, y, event) => {
            event.stopPropagation();

            this.scene.clearIndicator && this.scene.clearIndicator();

            const position = Coords.relativeCoords(
                this.getPosition(),
                Coords.zerify(
                    Coords.make(cx, cy)
                )
            );
            eventBridge.dispatchFromPhaser(
                ACTIONS.PLAYER.SYSTEM.TARGET,
                { target: { object: BODY_TYPES.PLANET, index, position } }
            );


            // move the timeout to a function given difference
            this.scene.cameras.main.pan(planetShape.x, planetShape.y, 1500);
        });
        this.shape = planetShape;
        this.objects.push(planet);
        this.objects.push(orbit);
    }

    setScale(scale) {
        const { radius, colour, position: { x, y }, center: { cx, cy } } = this.getInfo();
        this.destroy();
        this.shape = null;

        const { circle: orbit } = shapesHelper.drawCircle2Points(this.scene, { cx, cy }, { x, y }, { thickness: scale });
        const { shape, circle: planet } = shapesHelper.drawCircle(this.scene, { x, y, radius: radius * scale, colour });

        this.shape = shape;
        this.objects[0] = planet;
        this.objects[1] = orbit;
    }
}

export default Planet;