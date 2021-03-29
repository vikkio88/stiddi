import Phaser from "phaser";
import { Geom } from 'libs/math';
import { getSeededRandomizer } from 'libs/random';

class Asteroid {
    constructor(scene, { x, y, seed = 'test', scale = 1, fill = false, colour = 0xffffff, alpha = .9 } = {}) {
        this.scene = scene;
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

        this.body = this.scene.add.graphics();
        this.body.lineStyle(2, colour, alpha);
        this.body.fillStyle(colour, alpha);
        this.body.strokePoints(this.shape.points, true);

        if (fill) this.body.fillPoints(this.shape.points, true);
    }
}


export default Asteroid;