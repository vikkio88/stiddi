
import Phaser from "phaser";
import eventBridge, { EVENTS } from "libs/eventBridge";

class Boot extends Phaser.Scene {
    constructor() {
        super({ key: "Boot" });
    }

    preload() {
        const centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const loadingText = this.add.text(centerX, centerY, 'Booting...', {
            font: '40px monospace',
            stroke: '#cbd5e0',
            fontStyle: 'strong',
            strokeThickness: 2,
            fill: '#4299e1'
        }).setOrigin(0.5);

        this.load.on('complete', () => {
            loadingText.destroy();
        });

        this.load.image('player', 'assets/player.png');
    }

    create() {
        eventBridge.on(EVENTS.GAME.ACTIONS.BURN, payload => {
            console.log('[phaser] BURN RECEIVED', payload);
        });

        eventBridge.emit(EVENTS.PHASER.READY);

        this.scene.start("Main");
    }
}

export default Boot;