import Phaser from "phaser";
import { Coords } from "libs/math";
import eventBridge, { EVENTS } from "libs/eventBridge";
import sceneHelper from "phaser/helpers/sceneHelper";
import { Planet, Star, Indicator, Route } from "phaser/entities/system";
import Ship from "phaser/entities/system/Ship";
import { BODY_TYPES, ZOOM_SCALES } from "enums/systemMap";
import { HYPERDRIVE_ACTIONS } from "enums/navigation";
import { zoomHelper } from "phaser/helpers/zoomHelper";

const CAMERA_ANIMATION_DURATION = 1500;
const MIN_CAMERA_ANIMATION_DURATION = 900;
const MAX_CAMERA_ANIMATION_DURATION = 2000;

class SystemMap extends Phaser.Scene {
    constructor() {
        super({ key: "SystemMap", active: true });
        this.objects = {
            stars: [],
            planets: [],
            player: null
        };

        this.state = {
            hyperdrive: {
                engaged: false,
                dontFollow: false,
            }
        };
    }

    getCenter() {
        return sceneHelper.getCenter(this);
    }

    getSystemCenter() {
        return {
            x: this.center.x,
            y: this.center.y
        };
    }

    getCentrifiedSystemCenter() {
        return Coords.centrify(this.getSystemCenter());
    }

    eventsSubscribe() {
        eventBridge.on(EVENTS.GAME.MAPS.DRAW_SYSTEM, payload => {
            console.log('[phaser] DRAW SYSTEM', payload);

            payload.system.stars.forEach(s => this.addStar(s));
            payload.system.planets.forEach(p => this.addPlanet(p));
            this.addPlayer(payload.player);

            // check if maybe this should be only if locked
            if (payload.route.isPlotted) {
                this.addRoute(payload.target);
            }

            // This is to follow player after Engaging HD
            if (this.state.hyperdrive.engaged) {
                this.state.hyperdrive.dontFollow = false;
            }

            this.focusOnPlayer();
        });


        eventBridge.on(EVENTS.GAME.MAPS.ZOOM_SYSTEM, payload => {
            console.log('[phaser] ZOOM', { payload, zoom: this.cameras.main.zoom });
            if (payload.reset) {
                this.cameras.main.zoomTo(1, CAMERA_ANIMATION_DURATION);
                this.scaleObjects({ reset: true });
                return;
            }

            if (payload.level) {
                this.cameras.main.zoomTo(payload.level, CAMERA_ANIMATION_DURATION);
                this.scaleObjects({ level: payload.level });
                return;
            }
        });


        eventBridge.on(EVENTS.GAME.MAPS.CLEAR_SYSTEM, payload => {
            console.log('[phaser] CLEAR SYSTEM', { payload });

            if (this.state.hyperdrive.engaged) {
                this.state.hyperdrive.dontFollow = true;
            }

            this.cameras.main.setZoom(1);
            this.cameras.main.centerOn(this.center.x, this.center.y);
            this.clear();
        });

        eventBridge.on(EVENTS.GAME.MAPS.FOCUS_SYSTEM, payload => {
            console.log('[phaser] FOCUS SYSTEM', { payload });
            this.clearIndicator();

            if (payload.object === 'player') {
                this.focusOnPlayer({ pan: true });
                if (this.state.hyperdrive.engaged) {
                    this.state.hyperdrive.dontFollow = false;
                }
                return;
            }
            this.state.hyperdrive.dontFollow = true;
            const focusing = this.objects[payload.object][payload.index];
            const { x, y } = focusing.getPosition();
            this.panTo(x, y);
        });

        eventBridge.on(EVENTS.GAME.MAPS.CLEAR_PLOTROUTE_SYSTEM, () => {
            console.log('[PHASER] Clearing Route');
            this.clearRoute();
        });

        eventBridge.on(EVENTS.GAME.MAPS.PLOTROUTE_SYSTEM, ({ object, index }) => {
            console.log('[phaser] PLOT ROUTE SYSTEM', { object, index });
            this.addRoute({ object, index });
        });

        eventBridge.on(EVENTS.GAME.MAPS.UPDATE_PLAYER, ({ x, y }) => {
            //console.log('[phaser] UPDATE PLAYER POSITION MAP', { x, y, isVisible });
            this.addPlayer({ x, y });
        });


        eventBridge.on(EVENTS.GAME.ACTIONS.HYPERDRIVE, ({ action, payload }) => {
            console.log('[phaser SYSTEMMAP] HYPERDRIVE Action', { action, payload });
            this.handleHyperdrive(action, payload);
        });
    }

    getRelativeCoords({ x, y }) {
        return Coords.relativeCoords(
            { x, y },
            Coords.zerify(this.getSystemCenter())
        );
    }

    addPlayer(params) {
        if (this.objects.player) this.objects.player.destroy();
        const { x, y } = params;
        const { cx, cy } = this.getCentrifiedSystemCenter();
        this.objects.player = new Ship(this, cx + x, cy + y);

        if (this.state.hyperdrive.engaged && !this.state.hyperdrive.dontFollow) {
            const { x, y } = this.objects.player.getPosition();
            this.cameras.main.centerOn(x, y);
            return;
        }
    }

    addStar(params) {
        const star = new Star(this);
        star.add(params, this.getCentrifiedSystemCenter());
        this.objects.stars.push(star);
    }

    addPlanet(params) {
        const planet = new Planet(this);
        planet.add(params, this.getCentrifiedSystemCenter());
        this.objects.planets.push(planet);
    }

    addRoute({ object, index }) {
        this.clearRoute();
        const initial = this.objects.player.getPosition();
        let position = null;


        if (object === BODY_TYPES.MAP_INDICATOR) {
            position = {
                x: this.indicator.x,
                y: this.indicator.y,
            };
        }

        if ([BODY_TYPES.PLANET, BODY_TYPES.STAR].includes(object)) {
            const target = this.objects[object][index];
            position = target.getPosition();
        }

        if (!position) return;

        // might want to add something like Indicator at the end of the route
        this.route = new Route(this, initial, position);
        const relativeCoords = this.getRelativeCoords(position);
        eventBridge.dispatchFromPhaser(
            'player:plotSuccessSystem',
            {
                target: {
                    object, index,
                    position: relativeCoords
                }
            }
        );
    }

    clear() {
        this.objects.stars.forEach(s => s.destroy());
        this.objects.planets.forEach(p => p.destroy());
        if (this.objects.player) {
            this.objects.player.destroy();
        }

        this.clearIndicator();
        this.clearRoute();
    }

    create() {
        sceneHelper.setBackground(this);
        this.indicator = null;
        this.route = null;

        const { x, y } = sceneHelper.getCenter(this);
        this.center = { x, y };
        this.eventsSubscribe();

        this.input.on('pointerdown', ({ worldX: x, worldY: y }) => {
            // avoid clicking away if route is plotted
            if (!sceneHelper.isOnTop(this) || this.route) return;

            this.clearIndicator();
            this.indicator = new Indicator(this, x, y);
            const position = Coords.relativeCoords({ x, y }, Coords.zerify(this.center));
            eventBridge.dispatchFromPhaser(
                'player:targetSystem',
                { target: { object: BODY_TYPES.MAP_INDICATOR, position } }
            );
            this.panTo(x, y);
            console.log(`[PHASER] Indicator`, { x, y });
        });
    }

    clearIndicator() {
        if (this.indicator) {
            this.indicator.destroy();
        }
    }

    clearRoute() {
        if (this.route) {
            this.route.destroy();
            this.route = null;
        }
    }


    panTo(x, y) {
        const distance = Phaser.Math.Distance.BetweenPoints(this.getCenter(), { x, y });
        //const baseDistance = this.cameras.main.zoom

        // might need to consider the zoom level too
        const duration = Math.min(Math.max(
            (distance / 2000) * CAMERA_ANIMATION_DURATION,
            MIN_CAMERA_ANIMATION_DURATION
        ), MAX_CAMERA_ANIMATION_DURATION);
        this.cameras.main.pan(x, y, duration);
    }

    handleHyperdrive(action, payload) {
        if (action === HYPERDRIVE_ACTIONS.ENGAGED) {
            this.state.hyperdrive.engaged = true;
            this.state.hyperdrive.dontFollow = false;
            return;
        }

        if (action === HYPERDRIVE_ACTIONS.EXITED) {
            this.state.hyperdrive.engaged = false;
            this.cameras.main.setZoom(1);
            this.cameras.main.centerOn(this.center.x, this.center.y);
            return;
        }
    }

    focusOnPlayer({ pan = false } = {}) {
        if (!this.objects.player) return;
        const { x, y } = this.objects.player.getPosition();

        if (!pan) {
            this.cameras.main.centerOn(x, y);
            return;
        }

        this.panTo(x, y);
    }

    scaleObjects({ reset = false, level = 1 } = {}) {

        if (reset) {
            this.objects.planets.forEach(p => p.setScale(ZOOM_SCALES.default.planet));
            this.objects.player.setScale(ZOOM_SCALES.default.ship);
            return;
        }

        const planetScale = zoomHelper.scalePlanet(level);
        const shipScale = zoomHelper.scaleShip(level);
        this.objects.planets.forEach(p => p.setScale(planetScale));
        this.objects.player.setScale(shipScale);

    }

}

export default SystemMap;