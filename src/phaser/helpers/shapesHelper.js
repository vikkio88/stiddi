import Phaser from "phaser";

const shapesHelper = {
    drawCircle(scene, { x, y, radius, colour }) {
        const shape = new Phaser.Geom.Circle(x, y, radius);
        const circle = scene.add.graphics();
        circle.fillStyle(colour, 2);
        circle.fillCircleShape(shape);

        return { shape, circle };
    },

    drawCircle2Points(scene, { cx, cy }, { x, y }, config = {}) {
        const { colour = 0xffffff, alpha = .3, thickness = 1 } = config;

        const radius = Phaser.Math.Distance.Between(cx, cy, x, y);
        const shape = new Phaser.Geom.Circle(cx, cy, radius);
        const circle = scene.add.graphics();
        circle.lineStyle(thickness, colour, alpha);
        circle.strokeCircleShape(shape);

        return { shape, circle };

    }
};

export default shapesHelper;