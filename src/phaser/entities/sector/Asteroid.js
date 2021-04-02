import Phaser from "phaser";
import { Geom } from 'libs/math';
import { getSeededRandomizer } from 'libs/random';

class Asteroid {

    constructor(scene, { x, y, seed = 'test', scale = 1, fill = false, colour = 0xffffff, alpha = .9 } = {}) {
        this.scene = scene;
        this.style = {
            colour,
            alpha,
            fill
        };
        const rng = getSeededRandomizer(`${seed}`);
        const points = [];
        const maxPoints = 20 - rng.int(0, 5) + rng.int(0, 5);
        const maxRadius = rng.int(5, 10);
        for (let i = 0; i <= maxPoints; i++) {
            const point = Geom.pointOnCircumferenceRad(
                { cx: x, cy: y },
                scale * (maxRadius + rng.int(0, 2) - rng.int(0, 3)),
                (2 * Math.PI / maxPoints) * i - (Math.PI / rng.int(5, 10))
            );
            points.push(point);
        }

        this.shape = new Phaser.Geom.Polygon(points);

        const body = this.scene.add.graphics();
        body.lineStyle(2, colour, alpha);
        body.fillStyle(colour, alpha);
        body.strokePoints(this.shape.points, true);

        if (fill) body.fillPoints(this.shape.points, true);
        // TODO: move to a parent class
        this.body = body;
        this.isVisible = true;
    }

    // TODO: move to parent
    setVisible(visibility = false) {
        this.isVisible = visibility;
        this.body.setVisible(this.isVisible);
    }

    // TODO: move to parent
    destroy() {
        this.body.destroy();
    }
}


export default Asteroid;