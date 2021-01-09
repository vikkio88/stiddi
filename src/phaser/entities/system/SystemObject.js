import sceneHelper from "phaser/helpers/sceneHelper";

class SystemObject {
    constructor(scene) {
        this.scene = scene;
        this.objects = [];
        this.shape = null;

        this.info = {};
    }

    setInfo(info) {
        this.info = {
            ...this.info,
            ...info
        };
    }
    getInfo() {
        return this.info;
    }

    setId(id) {
        this.info = {
            ...this.info,
            id
        };
    }

    add(params) {

    }

    destroy() {
        this.objects.forEach(o => o.destroy());
    }

    getPosition() {
        return {
            x: this.shape ? this.shape.x : 0,
            y: this.shape ? this.shape.y : 0,
        };

    }

    setInteractive() {

    }

    on(event, callback) {

    }

    getSceneCenter() {
        const { x, y } = sceneHelper.getCenter(this.scene);
        return {
            cx: x,
            cy: y
        };
    }
}

export default SystemObject;