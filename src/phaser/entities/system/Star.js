import Phaser from "phaser";
import { Coords } from "libs/math";
import SystemObject from "./SystemObject";
import eventBridge from "libs/eventBridge";
import { BODY_TYPES } from "enums/systemMap";

class Star extends SystemObject {
    add({ id, index,name, radius, colour, type }) {
        this.setInfo({
            id, body: 'star', name, radius, type
        });
        const { cx, cy } = this.getSceneCenter();
        const starShape = new Phaser.Geom.Circle(cx, cy, radius);
        const star = this.scene.add.graphics();
        star.fillStyle(colour, 2);
        star.fillCircleShape(starShape);

        star.setInteractive(starShape, Phaser.Geom.Circle.Contains);

        star.on("pointerdown", (pointer, x, y, event) => {
            event.stopPropagation();
            const position = Coords.relativeCoords(
                this.getPosition(),
                Coords.zerify(
                    Coords.make(cx, cy)
                )
            );
            eventBridge.dispatchFromPhaser(
                'player:targetSystem',
                { target: { object: BODY_TYPES.STAR, index, position } }
            );

            this.scene.cameras.main.pan(starShape.x, starShape.y, 1500);
        });

        this.shape = starShape;
        this.objects.push(star);
    }
}

export default Star;