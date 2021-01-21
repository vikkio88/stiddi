import { Scene } from "phaser";
import sceneHelper from "phaser/helpers/sceneHelper";
import eventBridge, { EVENTS } from "libs/eventBridge";

class Boot extends Scene {
    constructor() {
        super({ key: "Boot", active: true });
    }

    preload() {
        sceneHelper.setBackground(this);
        const { x, y } = sceneHelper.getCenter(this);
        const loadingText = this.add.text(x, y, 'Booting up systems...', {
            font: '40px monospace',
            stroke: '#cbd5e0',
            fontStyle: 'strong',
            strokeThickness: 2,
            fill: '#4299e1'
        }).setOrigin(0.5);

        this.load.on('complete', () => {
            loadingText.destroy();
        });

        this.load.image('ship', 'assets/player.png');
        this.load.image('indicator', 'assets/indicator.png');
        this.load.image('tipCross', 'assets/tip-cross.png');
    }

    create() {
        eventBridge.emit(EVENTS.PHASER.READY);
    }
}

export default Boot;