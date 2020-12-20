import Phaser from "phaser";
import { Angle, ANGLES } from "libs/math";

const ACCELERATION_MULTIPLIER = 5;
const INITIAL_ANGLE = ANGLES.DEG_90;
const INITIAL_ROTATION = (Math.PI / 2);
export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "player", 0);
        scene.add.existing(this);
        //this.setScale(.5);
    }

    getAngle() {
        return this.angle - INITIAL_ANGLE;
    }

    getRotation() {
        return this.rotation - INITIAL_ROTATION;

    }

    burn(timeout) {
        const heading = this.getRotation();
        this.body.setAcceleration(
            ACCELERATION_MULTIPLIER * Math.cos(heading),
            ACCELERATION_MULTIPLIER * Math.sin(heading)
        );

        if (timeout) {
            setTimeout(
                function () { this.stopBurn(); }.bind(this),
                timeout
            );
        }
    }

    stopBurn() {
        this.body.setAcceleration(0, 0);
    }

    rotateTo(targetAngle) {
        const currentAngle = this.angle;
        let angle = targetAngle;
        let duration = (Math.abs(angle - currentAngle) / ANGLES.DEG_45) * 1000;
        if (currentAngle > ANGLES.DEG_90 || currentAngle <= 0) {
            const { angle: newAngle, rotation } = Angle.shortestRotation(currentAngle, targetAngle);
            angle = newAngle;
            duration = (rotation / 45) * 1000;
        }

        this.scene.tweens.add({
            targets: this,
            angle,
            duration,
        });
    }
}
