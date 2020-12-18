import Phaser from "phaser";

const ACCELERATION_MULTIPLIER = 5;
const INITIAL_ANGLE = (Math.PI / 2);
export default class extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "player", 0);
        scene.add.existing(this);
        //this.setScale(.5);
    }

    burn(timeout) {
        const heading = this.rotation - INITIAL_ANGLE;
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

    rotateTo(angle) {
        console.log('[phaser] rotating', { angle });

        // duration should be 2 secs per 45 deg
        // need to calculate type of rotation if 
        // clockwise or not

        const duration = (Math.abs(this.angle - angle) / 45) * 1000;
        const newAngle = Math.min(angle, Phaser.Math.Angle.ShortestBetween(angle, this.angle));
        console.log(`angle: ${angle}, newAngle: ${newAngle}, duration: ${duration}`);

        this.scene.tweens.add({
            targets: this,
            angle,
            duration
        });
    }
}
