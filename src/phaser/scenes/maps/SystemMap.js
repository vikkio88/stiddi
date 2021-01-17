import Phaser from "phaser";
import { Coords } from "libs/math";
import eventBridge, { EVENTS } from "libs/eventBridge";
import sceneHelper from "phaser/helpers/sceneHelper";
import { Planet, Star, Indicator, Route } from "phaser/entities/system";
import Ship from "phaser/entities/system/Ship";
import { BODY_TYPES } from "enums/systemMap";

const CAMERA_ANIMATION_DURATION = 1500;

class SystemMap extends Phaser.Scene {
    constructor() {
        super({ key: "SystemMap", active: true });
        this.objects = {
            stars: [],
            planets: [],
            player: null
        };
    }

    getCenter() {
        return sceneHelper.getCenter(this);
    }

    eventsSubscribe() {
        eventBridge.on(EVENTS.GAME.MAPS.DRAW_SYSTEM, payload => {
            console.log('[phaser] DRAW SYSTEM', payload);

            payload.system.stars.forEach(s => this.addStar(s));
            payload.system.planets.forEach(p => this.addPlanet(p));
            this.addPlayer(payload.player);
        });


        eventBridge.on(EVENTS.GAME.MAPS.ZOOM_SYSTEM, payload => {
            console.log('[phaser] ZOOM', { payload, zoom: this.cameras.main.zoom });
            if (payload.reset) {
                this.cameras.main.zoomTo(1, CAMERA_ANIMATION_DURATION);
                return;
            }

            if (payload.level) {
                this.cameras.main.zoomTo(payload.level, CAMERA_ANIMATION_DURATION);
                return;
            }

            this.cameras.main.zoomTo(this.cameras.main.zoom + ((payload.out ? -1 : 1) / 10), 500);
        });


        eventBridge.on(EVENTS.GAME.MAPS.CLEAR_SYSTEM, payload => {
            console.log('[phaser] CLEAR SYSTEM', { payload });

            this.cameras.main.setZoom(1);
            this.cameras.main.centerOn(this.center.x, this.center.y);
            this.clear();
        });

        eventBridge.on(EVENTS.GAME.MAPS.FOCUS_SYSTEM, payload => {
            console.log('[phaser] FOCUS SYSTEM', { payload });
            this.clearIndicator();

            if (payload.object === 'player') {
                const { x, y } = this.objects.player.getPosition();
                this.panTo(x, y);
                return;
            }

            const focusing = this.objects[payload.object][payload.index];
            const { x, y } = focusing.getPosition();
            this.panTo(x, y);
        });

        eventBridge.on(EVENTS.GAME.MAPS.PLOTROUTE_SYSTEM, ({ object, index }) => {
            console.log('[phaser] PLOT ROUTE SYSTEM', { object, index });
            this.clearRoute();
            const initial = this.objects.player.getPosition();

            if (object === BODY_TYPES.MAP_INDICATOR) {
                const target = {
                    x: this.indicator.x,
                    y: this.indicator.y,
                };
                this.route = new Route(this, initial, target);
                /*
                const half = this.route.getPoint(.5);
                this.panTo(half.x, half.y);
                */
                return;
            }

            if ([BODY_TYPES.PLANET, BODY_TYPES.STAR].includes(object)) {
                const target = this.objects[object][index];
                this.route = new Route(this, initial, target.getPosition());
                /*
                const half = this.route.getPoint(.5);
                this.panTo(half.x, half.y);
                */
                eventBridge.dispatchFromPhaser('');
                return;
            }
        });
    }

    addPlayer(params) {
        const { x, y } = params;
        const { x: cx, y: cy } = this.getCenter();
        this.objects.player = new Ship(this, cx + x, cy + y);
    }

    addStar(params) {
        const star = new Star(this);
        star.add(params);
        this.objects.stars.push(star);
    }

    addPlanet(params) {
        const planet = new Planet(this);
        planet.add(params);
        this.objects.planets.push(planet);
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
        this.add.text(x, y - 100, "SYSTEM MAP").setOrigin(.5);
        this.eventsSubscribe();
        this.input.on('pointerdown', ({ worldX: x, worldY: y }) => {
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
        }
    }


    panTo(x, y) {
        this.cameras.main.pan(x, y, CAMERA_ANIMATION_DURATION);
    }
}

export default SystemMap;