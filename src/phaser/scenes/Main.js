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
        });

        eventBridge.on(EVENTS.GAME.ACTIONS.ROTATE, payload => {
            console.log('[phaser] ROTATE RECEIVED', payload);
            this.player.angle += (payload.direction) * 10;
        });
    }

    create() {
        this.player = new Player(this, this.cameras.main.centerX, this.cameras.main.centerY);
        this.radarLeft = this.add.line(0, 0, -10, -10, 10, 10, '#fff');


        this.eventsSubscribe();
    }
}

export default Main;