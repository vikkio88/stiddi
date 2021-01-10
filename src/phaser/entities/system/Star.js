import Phaser from "phaser";
import SystemObject from "./SystemObject";

class Star extends SystemObject {
    add({ id, name, radius, colour }) {
        this.setInfo({
            id, body: 'star', name, radius
        });
        const { cx, cy } = this.getSceneCenter();
        const starShape = new Phaser.Geom.Circle(cx, cy, radius);
        const star = this.scene.add.graphics();
        star.fillStyle(colour, 2);
        star.fillCircleShape(starShape);

        star.setInteractive(starShape, Phaser.Geom.Circle.Contains);

        star.on("pointerdown", (pointer, x, y, event) => {
            event.stopPropagation();
            console.log(`clicked on star ${name}`, this.getInfo());
            // move the timeout to a function given difference
            this.scene.cameras.main.pan(starShape.x, starShape.y, 1500);
        });

        this.shape = starShape;
        this.objects.push(star);
    }
}

export default Star;