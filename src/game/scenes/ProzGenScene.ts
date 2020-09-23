import Phaser from "phaser";
import sprWater from "Assets/sprWater.png";
import sprGrass from "Assets/sprGrass.png";
import sprSand from "Assets/sprSand.png";
import { Chunk } from "./Entities";

const KEY_SPRITE_WATER = "sprWater";
const KEY_SPRITE_SAND = "sprSand";
const KEY_SPRITE_GRASS = "sprGrass";

class ProzGenScene extends Phaser.Scene {
    chunkSize = 16;
    tileSize = 16;
    chunkLength = this.chunkSize * this.tileSize;
    cameraSpeed = 10;
    chunks?: Chunk[];
    followPoint?: Phaser.Math.Vector2;

    keyW?: Phaser.Input.Keyboard.Key;
    keyA?: Phaser.Input.Keyboard.Key;
    keyS?: Phaser.Input.Keyboard.Key;
    keyD?: Phaser.Input.Keyboard.Key;

    constructor() {
        super("ProzGenScene");
    }

    preload() {
        this.load.spritesheet(KEY_SPRITE_WATER, sprWater, {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.image(KEY_SPRITE_SAND, sprSand);
        this.load.image(KEY_SPRITE_GRASS, sprGrass);
    }

    create() {
        this.anims.create({
            key: KEY_SPRITE_WATER,
            frames: this.anims.generateFrameNumbers(KEY_SPRITE_WATER, {
                start: 0,
                end: 3,
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.keyW = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.W
        );
        this.keyS = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.S
        );
        this.keyA = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.A
        );
        this.keyD = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        );

        this.cameras.main.setZoom(2);
        this.chunks = [];

        this.followPoint = new Phaser.Math.Vector2(
            this.cameras.main.worldView.x +
                this.cameras.main.worldView.width * 0.5,
            this.cameras.main.worldView.y +
                this.cameras.main.worldView.height * 0.5
        );
    }

    getChunk(x: number, y: number) {
        let chunk = null;
        if (this.chunks) {
            for (let i = 0; i < this.chunks.length; i++) {
                if (this.chunks[i].x === x && this.chunks[i].y === y) {
                    chunk = this.chunks[i];
                }
            }
        }
        return chunk;
    }
    update() {
        if (this.followPoint && this.chunks) {
            let snappedChunkX =
                this.chunkLength *
                Math.round(this.followPoint?.x / this.chunkLength);
            let snappedChunkY =
                this.chunkLength *
                Math.round(this.followPoint?.y / this.chunkLength);

            snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
            snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

            for (let x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
                for (let y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
                    const existingChunk = this.getChunk(x, y);

                    if (existingChunk === null) {
                        const newChunk = new Chunk(this, x, y);
                        this.chunks?.push(newChunk);
                    }
                }
            }

            for (let i = 0; i < this.chunks.length; i++) {
                const chunk = this.chunks[i];

                if (
                    Phaser.Math.Distance.Between(
                        snappedChunkX,
                        snappedChunkY,
                        chunk.x,
                        chunk.y
                    ) < 3
                ) {
                    if (chunk !== null) {
                        chunk.load();
                    }
                } else {
                    if (chunk !== null) {
                        chunk.unload();
                    }
                }
            }

            if (this.keyW && this.keyA && this.keyD && this.keyS) {
                if (this.keyW.isDown) {
                    this.followPoint.y -= this.cameraSpeed;
                }
                if (this.keyS.isDown) {
                    this.followPoint.y += this.cameraSpeed;
                }
                if (this.keyA.isDown) {
                    this.followPoint.x -= this.cameraSpeed;
                }
                if (this.keyD.isDown) {
                    this.followPoint.x += this.cameraSpeed;
                }

                this.cameras.main.centerOn(
                    this.followPoint.x,
                    this.followPoint.y
                );
            }
        }
    }
}

export default ProzGenScene;
