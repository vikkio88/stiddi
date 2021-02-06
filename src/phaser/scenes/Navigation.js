import Phaser from "phaser";
import eventBridge, { EVENTS } from "libs/eventBridge";
import { Ship, LockedRoute } from "phaser/entities/navigation";

import { HYPERDRIVE_ACTIONS } from "enums/navigation";
import { randomizer } from "libs/random";
import { Geom } from "libs/math";
import sceneHelper from "phaser/helpers/sceneHelper";

class Navigation extends Phaser.Scene {
    constructor() {
        super({ key: "Navigation" });

        this.state = {
            hyperdrive: {
                locked: false,
                engaged: false,
                // engaging angle
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
            this.ship.fullStop();
        });

        eventBridge.on(EVENTS.GAME.ACTIONS.HYPERDRIVE, ({ action, payload }) => {
            console.log('[phaser] HYPERDRIVE Action', { action, payload });
            this.handleHyperdrive(action, payload);
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
        // using a small loop that can be react based on speed
        this.uiUpdate();

        // Hyperdrive Animation
        this.hyperdrive = null;
    }

    uiUpdate() {
        const { speed, position } = this.ship.getNavigation();
        //console.log('[PHASER] uiUpdateLoop', { speed });

        if (speed > 0) {
            this.updateLockedRoute(position.x, position.y);
            //this.castRadar(position.x, position.y, 250);
        }
        const timeout = speed < 50 ? 3000 : 1500;
        setTimeout(() => this.uiUpdate(), timeout);
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

    updateLockedRoute(x, y) {
        if (this.arc) this.arc.destroy();
        if (!this.state.hyperdrive.locked) return;

        this.arc = LockedRoute.draw(this, { x, y }, this.state.hyperdrive.angle);
    }

    handleHyperdrive(action, payload) {
        const { x, y } = this.ship;
        if (action === HYPERDRIVE_ACTIONS.LOCKED) {
            this.state.hyperdrive.locked = true;
            this.state.hyperdrive.angle = payload.angle;
            this.updateLockedRoute(x, y);
            return;
        }

        if (action === HYPERDRIVE_ACTIONS.UNLOCKED) {
            this.state.hyperdrive.locked = false;
            this.updateLockedRoute();
            return;
        }

        if (action === HYPERDRIVE_ACTIONS.ENGAGED) {
            this.state.hyperdrive.locked = false;
            this.state.hyperdrive.engaged = true;
            // if in hyperdrive we need to stop hearthbeat
            this.ship.stopHeartBeat();
            // stop current speed
            this.ship.fullStop();
            this.mainCamera.stopFollow();
            // if we jump out hyperdrive we need to start it again
            // maybe with a small speed left
            this.updateLockedRoute();

            this.hyperdriveAnimationToggle();
            return;
        }

        if (action === HYPERDRIVE_ACTIONS.EXITED) {
            this.state.hyperdrive.locked = false;
            this.state.hyperdrive.engaged = false;
            // if in hyperdrive we need to stop hearthbeat
            // out of hyperdrive we come in a random direction/speed
            const angle = randomizer.int(0, 350);
            const velocityX = randomizer.int(0, 50);
            const velocityY = randomizer.int(0, 50);

            console.log('[PHASER] Exited Hyperdrive with', { angle, vel: { velocityX, velocityY } });
            this.hyperdriveAnimationToggle();
            this.mainCamera.startFollow(this.ship);
            this.ship.setAngle(angle);
            this.ship.body.setVelocityX(velocityX);
            this.ship.body.setVelocityY(velocityY);
            this.ship.startHeartBeat();
            return;
        }
    }

    hyperdriveAnimationToggle() {
        console.log('[PHASER] ENGAGED HD ANIMATION');
        if (this.hyperdrive !== null) {
            this.hyperdrive.coma.comaEmitter.stop();
            this.hyperdrive.coma.comaEmitter.killAll();
            this.hyperdrive.coma.shipComa.destroy();
            this.hyperdrive.stars.randomStarsEmitter.stop();
            this.hyperdrive.stars.randomStarsEmitter.killAll();
            this.hyperdrive.stars.randomStars.destroy();
            this.mainCamera.shake(2000, 0.0009);
            this.hyperdrive = null;
            return;
        }

        this.mainCamera.shake(2000, 0.0009);
        const { x, y } = sceneHelper.getCenter(this);
        const shipComa = this.add.particles('tipCross');

        const { x: dx, y: dy } = this.ship.getDirections();
        const accelerationX = -400 * dx;
        const accelerationY = -400 * dy;
        const comaEmitter = shipComa.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.3, end: 4.5 },
            tint: 0x0000ff,
            speed: 20,
            accelerationY,
            accelerationX,
            angle: { min: -85, max: -95 },
            rotate: { min: -180, max: 180 },
            lifespan: { min: 1000, max: 1100 },
            blendMode: 'ADD',
            frequency: 60,
            maxParticles: 50,
            x,
            y
        });

        const randomStars = this.add.particles('tipCross');
        const { x: cx1, y: cy1 } = Geom.pointOnCircumference({ cx: x, cy: y }, 600, this.ship.angle - 40);
        const { x: cx2, y: cy2 } = Geom.pointOnCircumference({ cx: x, cy: y }, 600, this.ship.angle + 40);
        const randomStarsEmitter = randomStars.createEmitter({
            x: { min: cx1, max: cx2 },
            y: { min: cy1, max: cy2 },
            alpha: { start: 1, end: 0 },
            scale: { start: 0.3, end: 0.5 },
            speedX: 40 * dx,
            speedY: 40 * dy,
            accelerationX, accelerationY,
            lifespan: { min: 0, max: 3000 },
            blendMode: 'ADD',
            frequency: 10,
            maxParticles: 300
        });

        this.hyperdrive = {
            coma: { shipComa, comaEmitter },
            stars: { randomStars, randomStarsEmitter }
        };
    }
}

export default Navigation;