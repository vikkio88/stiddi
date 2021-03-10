import Phaser from "phaser";

const shapesHelper = {
    drawCircle(scene, { x, y, radius, colour }) {
        const shape = new Phaser.Geom.Circle(x, y, radius);
        const circle = scene.add.graphics();
        circle.fillStyle(colour, 2);
        circle.fillCircleShape(shape);

        return { shape, circle };
    }
};

export default shapesHelper;