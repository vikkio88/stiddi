import Phaser from "phaser";
import eventBridge, { EVENTS } from "libs/eventBridge";
import { Ship, LockedRoute } from "phaser/entities/navigation";

import { HYPERDRIVE_ACTIONS } from "enums/navigation";

class Navigation extends Phaser.Scene {
    constructor() {
        super({ key: "Navigation" });

        this.state = {
            hyperdrive: {
                locked: false,
                angle: 0
            }
        };
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
            // here might need to update the drawLockedRoute
            // if the angle is the correct one and maybe we 
            // want to colour it differently
        });

        eventBridge.on(EVENTS.GAME.ACTIONS.FULL_STOP, () => {
            console.log('[phaser] FULL STOP RECEIVED');
            this.ship.body.setAcceleration(0, 0);
            this.ship.body.setVelocity(0, 0);
        });

        eventBridge.on(EVENTS.GAME.ACTIONS.HYPERDRIVE, ({ action, payload }) => {
            console.log('[phaser] HYPERDRIVE Action', { action, payload });
            const { x, y } = this.ship;
            if (action === HYPERDRIVE_ACTIONS.LOCKED) {
                this.state.hyperdrive.locked = true;
                this.state.hyperdrive.angle = payload.angle;
                this.drawLockedRoute(x, y);
            }

            if (action === HYPERDRIVE_ACTIONS.UNLOCKED) {
                this.state.hyperdrive.locked = false;
                // this will clear it
                this.drawLockedRoute();
            }

        });
    }

    create() {
        this.mainCamera = this.cameras.main;
        this.mainCamera.setBackgroundColor(0x000000);
        const { centerX, centerY } = this.mainCamera;

        //this.grid = this.add.grid(centerX, centerY, 64 * 5, 64 * 5, 64, 64, 0xffffff, 0, 0xffffff, 0.3);
        this.ship = new Ship(this, centerX, centerY);
        this.physics.world.enable(this.ship);
        this.ship.startHeartBeat();
        // will move init of physics and HB inside player

        this.mainCamera.startFollow(this.ship);
        this.eventsSubscribe();

        this.drawLockedRoute(centerX, centerY, 90);
        setInterval(() => {
            if (this.ship.getNavigation().speed > 0) {
                //console.log('casting radar');
                const { x, y } = this.ship;
                //this.castRadar(x, y, 250);
                this.drawLockedRoute(x, y, 90);
            }
        }, 3000);
    }

    castRadar(x, y, range) {
        const radarEdge = new Phaser.Geom.Circle(x, y, range);
        if (this.radar) {
            this.radar.destroy();
        }
        this.radar = this.add.graphics();
        this.radar.fillStyle(0xffffff);
        this.radar.strokeCircleShape(radarEdge);
        //this.radar.fillCirle(radarEdge);

        //this.radar = this.radar.createGeometryMask()
        //this.grid.setPosition(x,y);
        //this.grid.setMask(this.radar);

    }

    drawLockedRoute(x, y,) {
        if (this.arc) this.arc.destroy();
        if (!this.state.hyperdrive.locked) return;

        this.arc = LockedRoute.draw(this, { x, y }, this.state.hyperdrive.angle);
    }
}

export default Navigation;