import Phaser from "phaser";
import eventBridge, { EVENTS } from "libs/eventBridge";
import ACTIONS from "store/actions";
import { Angle, ANGLES } from "libs/math";
import shapesHelper from "phaser/helpers/shapesHelper";

const ACCELERATION_MULTIPLIER = 5;
const HEARTBEAT_TIMEOUT = 1500;

const INITIAL_ANGLE = ANGLES.DEG_90;
const INITIAL_ROTATION = (Math.PI / 2);

const MAX_DROPLETS = 10;


export default class Ship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "ship", 0);
        scene.add.existing(this);
        this.heartBeat = {
            last: null,
            send: false,
            timeout: HEARTBEAT_TIMEOUT
        };
        this.depth = 100;

        this.state = {
            trace: {
                drop: false,
                droplets: []
            }
        };
    }

    startHeartBeat() {
        this.heartBeat.send = true;
        this.beat();
    }

    stopHeartBeat() {
        this.heartBeat.send = false;
    }

    beat() {
        const payload = this.getNavigation();
        if (
            this.heartBeat.send
            && this.isBeatPayloadChanged(this.heartBeat.last, payload)
        ) {
            this.heartBeat.last = payload;
            eventBridge.emit(EVENTS.PHASER.HEARTBEAT, payload);
        }

        setTimeout(() => this.beat(), this.heartBeat.timeout);
    }

    triggeredUpdate() {
        this.trace();
    }

    getNavigation() {
        const { velocity, speed } = this.body;
        const direction = Math.atan2(velocity.y, velocity.x) * ANGLES.DEG_180 / Math.PI;
        const heading = Math.floor((this.getAngle() + INITIAL_ANGLE) % ANGLES.DEG_360);
        return {
            heading,
            direction: speed <= 1 ? heading : Math.floor(direction + INITIAL_ANGLE),
            speed,
            position: { x: Math.floor(this.x), y: Math.floor(this.y) }
        };
    }

    isBeatPayloadChanged(last, current) {
        if (!last) return true;
        const { heading, direction, speed, position } = current;
        const { heading: lHeading, direction: lDirection, speed: lSpeed, position: lPosition = {} } = last;
        return (
            (heading !== lHeading) ||
            (direction !== lDirection) ||
            (speed !== lSpeed) ||
            (position.x !== lPosition.x || position.y !== lPosition.y)
        );
    }

    getAngle() {
        return this.angle - INITIAL_ANGLE;
    }

    getRotation() {
        return this.rotation - INITIAL_ROTATION;
    }

    getDirections() {
        const heading = this.getRotation();
        return {
            x: Math.cos(heading),
            y: Math.sin(heading)
        };
    }

    burn(timeout, throttle) {
        const heading = this.getRotation();
        this.body.setAcceleration(
            ACCELERATION_MULTIPLIER * throttle * Math.cos(heading),
            ACCELERATION_MULTIPLIER * throttle * Math.sin(heading)
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
        eventBridge.dispatchFromPhaser(ACTIONS.NAV.UNLOCK.NAV);
    }

    fullStop() {
        this.body.setAcceleration(0, 0);
        this.body.setVelocity(0, 0);
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
            onComplete: () => eventBridge.dispatchFromPhaser(ACTIONS.NAV.UNLOCK.NAV)
        });
    }

    trace() {
        const { trace } = this.state;
        if (!trace.drop) return;

        const { circle: droplet } = shapesHelper.drawCircle(
            this.scene,
            { x: this.x, y: this.y, radius: 2, colour: 0xffffff }
        );
        if (trace.droplets.length === MAX_DROPLETS) {
            const first = trace.droplets[0];
            first && first.destroy();
            trace.droplets.shift();
        }

        trace.droplets.push(droplet);
    }

    toggleTrace() {
        const { trace } = this.state;
        const newValue = !trace.drop;
        trace.drop = newValue;

        if (!newValue) {
            trace.droplets.map(d => d.destroy());
        }
    }
}
