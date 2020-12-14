import Phaser from "phaser";
import eventBridge, { EVENTS } from "libs/eventBridge";
import { Player } from "../entities";

class Main extends Phaser.Scene {
    constructor() {
        super({ key: "Main" });
    }

    eventsSubscribe() {
        eventBridge.on(EVENTS.GAME.ACTIONS.BURN, payload => {
            console.log('[phaser] BURN RECEIVED', payload);
            const heading = this.player.rotation - (Math.PI / 2);
            const ACCELERATION_MULTIPLIER = 5;
            this.player.body.setAcceleration(ACCELERATION_MULTIPLIER * Math.cos(heading), ACCELERATION_MULTIPLIER * Math.sin(heading));

            if (payload.timeout) {
                setTimeout(() => {
                    this.player.body.setAcceleration(0, 0);
                    console.log('[phaser] burn timeout: turning off', { speed: this.player.body.speed });
                }, payload.timeout);
            }
        });

        eventBridge.on(EVENTS.GAME.ACTIONS.ROTATE, payload => {
            this.player.angle += (payload.direction) * 10;
            console.log('[phaser] ROTATE RECEIVED', payload, { angle: this.player.angle });
        });

        eventBridge.on(EVENTS.GAME.ACTIONS.FULL_STOP, payload => {
            console.log('[phaser] fullstop', payload, { angle: this.player.angle, speed: this.player.body.speed, acc: this.player.body.acceleration });
            this.player.body.setAcceleration(0, 0);
            this.player.body.setVelocity(0, 0);
        });
    }

    create() {
        this.mainCamera = this.cameras.main;

        this.grid = this.add.grid(0, 0, 3000, 3000, 64, 64, 0xffffff, 0, 0xffffff, 0.3);
        this.player = new Player(this, this.cameras.main.centerX, this.cameras.main.centerY);
        this.physics.world.enable(this.player);
        this.mainCamera.startFollow(this.player);
        this.eventsSubscribe();
    }
}

export default Main;