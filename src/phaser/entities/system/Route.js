import Phaser from "phaser";
import TipCross from "./TipCross";

class Route {
    constructor(scene, initial, target) {
        this.scene = scene;

        this.lineShape = new Phaser.Geom.Line(initial.x, initial.y, target.x, target.y);
        this.route = this.scene.add.graphics();
        this.route.fillStyle(0xffffff);
        this.route.strokeLineShape(this.lineShape);
        this.addTip(target);
    }

    addTip({ x, y }) {
        this.tip = new TipCross(this.scene, x, y);
    }

    getPoint(ratio) {
        return this.lineShape.getPoint(ratio);
    }

    destroy() {
        this.route.destroy();
        this.tip.destroy();
    }
}


export default Route;