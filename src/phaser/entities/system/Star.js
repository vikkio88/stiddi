import Phaser from "phaser";
import SystemObject from "./SystemObject";

class Star extends SystemObject {
    add({ id, radius, colour }) {
        const { cx, cy } = this.getSceneCenter();
        const starShape = new Phaser.Geom.Circle(cx, cy, radius);
        const star = this.scene.add.graphics();
        star.fillStyle(colour, 2);
        star.fillCircleShape(starShape);

        star.setInteractive(starShape, Phaser.Geom.Circle.Contains);

        star.on("pointerdown", () => {
            console.log(`clicked on star ${id}`);
            this.scene.cameras.main.centerOn(starShape.x, starShape.y);
        });

        this.shape = starShape;
        this.objects.push(star);
    }
}

export default Star;