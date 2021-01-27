import Phaser from "phaser";
import { ANGLES } from "libs/math";

class LockedRoute {
    static drawArc(arc, { x, y }, offset, [start, end]) {
        arc.beginPath();
        arc.arc(x, y, offset, start, end, true);
        arc.strokePath();
        arc.closePath();
    }

    static draw(scene, { x, y }, angle, colour = 0xffffff) {
        angle = angle - ANGLES.DEG_90;
        const offset = 15;
        const startAngle = Phaser.Math.DegToRad(angle + offset);
        const endAngle = Phaser.Math.DegToRad(angle - offset);

        const arc = scene.add.graphics();
        arc.lineStyle(5, colour, 1);
        this.drawArc(arc, { x, y }, 300, [startAngle, endAngle]);
        this.drawArc(arc, { x, y }, 250, [startAngle, endAngle]);
        this.drawArc(arc, { x, y }, 200, [startAngle, endAngle]);
        this.drawArc(arc, { x, y }, 150, [startAngle, endAngle]);

        return arc;
    }

}

export default LockedRoute;