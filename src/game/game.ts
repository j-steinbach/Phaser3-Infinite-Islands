import Phaser from "phaser";
import ProzGenScene from "./scenes/ProzGenScene";

export const initGame = (_parent: string) => {
    const game = new Phaser.Game(config);
    return game;
};

const width = 640;
const height = 640;

// The config object is how you configure your Phaser Game.
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO, //  tries to use WebGL, but if the browser or device doesn't support it it'll fall back to Canvas
    width,
    height,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: true,
        },
    },
    scene: [ProzGenScene],
    scale: {
        zoom: 2,
        mode: Phaser.Scale.ScaleModes.FIT,
        autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY,
    },
    backgroundColor: "#232323",
};
