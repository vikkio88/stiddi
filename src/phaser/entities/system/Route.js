import Phaser from "phaser";

class Route {
    constructor(scene, initial, target) {
        this.scene = scene;

        this.lineShape = new Phaser.Geom.Line(initial.x, initial.y, target.x, target.y);
        this.route = this.scene.add.graphics();
        this.route.fillStyle(0xffffff, 1);
        this.route.strokeLineShape(this.lineShape);
    }

    getPoint(ratio) {
        return this.lineShape.getPoint(ratio);
    }

    destroy() {
        this.route.destroy();
    }
}


export default Route;