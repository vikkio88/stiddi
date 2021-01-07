import Phaser from "phaser";
import eventBridge, { EVENTS } from "libs/eventBridge";
import { Ship } from "../entities";

class Navigation extends Phaser.Scene {
    constructor() {
        super({ key: "Navigation" });
    }

    eventsSubscribe() {
        eventBridge.on(EVENTS.GAME.EFFECTS.SHAKE, ({ duration }) => {
            console.log('[phaser] SHAKE RECEIVED', { duration });
            this.mainCamera.shake(duration, 0.0009);
        });

        eventBridge.on(EVENTS.GAME.ACTIONS.BURN, ({ timeout, throttle }) => {
            console.log('[phaser] BURN RECEIVED', { timeout, throttle });
            this.ship.burn(timeout, throttle);
        });

        eventBridge.on(EVENTS.GAME.ACTIONS.ROTATE, ({ angle }) => {
            console.log('[phaser] ROTATE RECEIVED', angle);
            this.ship.rotateTo(angle);
        });

        eventBridge.on(EVENTS.GAME.ACTIONS.FULL_STOP, () => {
            console.log('[phaser] FULL STOP RECEIVED');
            this.ship.body.setAcceleration(0, 0);
            this.ship.body.setVelocity(0, 0);
        });
    }

    create() {
        this.mainCamera = this.cameras.main;
        this.mainCamera.setBackgroundColor(0x000000);
        const { centerX, centerY } = this.mainCamera;

        this.grid = this.add.grid(centerX, centerY, 64 * 5, 64 * 5, 64, 64, 0xffffff, 0, 0xffffff, 0.3);
        this.ship = new Ship(this, centerX, centerY);
        this.physics.world.enable(this.ship);
        this.ship.startHeartBeat();
        // will move init of physics and HB inside player

        this.mainCamera.startFollow(this.ship);
        this.eventsSubscribe();

        setInterval(() => {
            if (this.ship.getNavigation().speed > 0) {
                console.log('casting radar');
                this.castRadar(
                    this.ship.x,
                    this.ship.y,
                    250
                );
            }
        }, 3000);
    }

    castRadar(x, y, range) {
        const radarEdge = new Phaser.Geom.Circle(x, y, range);
        if (this.radar) {
            this.radar.destroy();
        }
        this.radar = this.add.graphics();
        this.radar.fillStyle(0xffffff, 2);
        this.radar.strokeCircleShape(radarEdge);
        //this.radar.fillCirle(radarEdge);

        //this.radar = this.radar.createGeometryMask()
        //this.grid.setPosition(x,y);
        //this.grid.setMask(this.radar);

    }
}

export default Navigation;