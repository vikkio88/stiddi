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

    },

    drawRect(scene, { x = 0, y = 0, h = 64, w = 64, colour = 0xffffff } = {}) {
        const shape = new Phaser.Geom.Rectangle(x, y, w, h);
        const rect = scene.add.rectangle(x, y, w, h, colour);
        rect.setStrokeStyle(colour, 2);
        return { shape, rect };
    }
};

export default shapesHelper;