import Phaser from "phaser";
import ProzGenScene from "./ProzGenScene";
import Perlin from "phaser3-rex-plugins/plugins/perlin.js";

export class Chunk {
    scene: ProzGenScene;
    x: number;
    y: number;
    tiles: Phaser.GameObjects.Group;
    isLoaded = false;

    constructor(scene: ProzGenScene, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.tiles = this.scene.add.group();
    }

    unload() {
        if (this.isLoaded) {
            this.tiles.clear(true, true);
            this.isLoaded = false;
        }
    }

    load() {
        if (!this.isLoaded) {
            const seed = Phaser.Math.FloatBetween(0, 1);
            const noise = new Perlin(seed);

            for (let x = 0; x < this.scene.chunkSize; x++) {
                for (let y = 0; y < this.scene.chunkSize; y++) {
                    const tileX =
                        this.x * this.scene.chunkLength +
                        x * this.scene.tileSize;
                    const tileY =
                        this.y * this.scene.chunkLength +
                        y * this.scene.tileSize;

                    const perlinVal: number = noise.perlin2(
                        tileX / 100,
                        tileY / 100
                    );

                    let key = "";
                    let animationKey = "";

                    if (perlinVal < 0.2) {
                        key = "sprWater";
                        animationKey = "sprWater";
                    } else if (perlinVal >= 0.2 && perlinVal < 0.3) {
                        key = "sprSand";
                    } else if (perlinVal >= 0.3) {
                        key = "sprGrass";
                    }

                    const tile = new Tile(this.scene, tileX, tileY, key);

                    if (animationKey !== "") {
                        tile.play(animationKey);
                    }

                    this.tiles.add(tile);
                }
            }
            this.isLoaded = true;
        }
    }
}

class Tile extends Phaser.GameObjects.Sprite {
    scene: ProzGenScene;

    constructor(scene: ProzGenScene, x: number, y: number, key: string) {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setOrigin(0);
    }
}
