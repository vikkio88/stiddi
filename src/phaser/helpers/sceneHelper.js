const sceneHelper = {
    setBackground(scene, colour = 0x000000) {
        scene.cameras.main.setBackgroundColor(colour);
    },

    getCenter(scene, offset = { x: 0, y: 0 }) {
        const x = scene.cameras.main.worldView.x + scene.cameras.main.width / 2 + offset.x;
        const y = scene.cameras.main.worldView.y + scene.cameras.main.height / 2 + offset.y;
        return { x, y };
    },


    isOnTop(scene) {
        const scenes = scene.scene.manager.scenes.map(s => s.scene.key);
        const topScene = scenes.pop();
        return topScene === scene.scene.key;
    }
};

export default sceneHelper;