import { GameModal } from "./map.js";
import { GameScene } from "../game_scene.js";
import { Images } from "../resources.js";
import * as drawSprite from "../draw_sprite.js";
import {Point} from "../point.js";
type p5 = any;

export class IntroModal implements GameModal {
    removeModal?: () => void;
    blockKey = true;

    scene: GameScene;
    noImpostor: number;
    startTime: number;

    constructor(scene: GameScene, noImpostor: number) {
        this.scene = scene;
        this.noImpostor = noImpostor;
        this.startTime = Date.now();
    }

    render(sketch: p5) {
        if (Date.now() - this.startTime > 9000) this.removeModal?.();
        if (Date.now() - this.startTime < 1000) {
            sketch.fill(0, (Date.now() - this.startTime) / 1000 * 255);
        } else if (Date.now() - this.startTime > 8000) {
            sketch.fill(0, 255 - (Date.now() - this.startTime - 8000) / 1000 * 255);
        } else {
            sketch.fill(0);
        }
        sketch.noStroke();
        sketch.rect(0, 0, sketch.windowWidth, sketch.windowHeight);

        if (Date.now() - this.startTime >= 1500) {
            const alpha = (() => {
                if (Date.now() - this.startTime < 2500) return (Date.now() - this.startTime - 1500)/1000*255;
                else if (Date.now() - this.startTime > 7000) return Math.max(0, 255 - (Date.now() - this.startTime - 7000)/1000*255);
                else return 255;
            })();
            sketch.textAlign(sketch.CENTER, sketch.BASELINE);
            sketch.textSize(70);
            let displayedPlayers = [ this.scene.username ];
            if (this.scene.players[this.scene.username].isImpostor) {
                sketch.fill(233, 59, 42, alpha);
                sketch.text("Impostor", sketch.windowWidth/2, sketch.windowHeight/4);
                for (const username in this.scene.players) {
                    if (this.scene.username == username) continue;
                    if (this.scene.players[username].isImpostor)
                        displayedPlayers.push(username);
                }
            } else {
                sketch.fill(167, 252, 254, alpha);
                sketch.text("Crewmate", sketch.windowWidth/2, sketch.windowHeight/4);
                sketch.textSize(30);
                sketch.fill(255, alpha);
                const message = (() => {
                    if (this.noImpostor == 1)
                        return "There is 1 Impostor among us";
                    else
                        return `There are ${this.noImpostor} Impostors among us`;
                })();
                sketch.text(message, sketch.windowWidth/2, sketch.windowHeight/4 + 50);
                for (const username in this.scene.players) {
                    if (this.scene.username == username) continue;
                    displayedPlayers.push(username);
                }
            }

            let level = 0;
            let x = 0;
            for (const username of displayedPlayers) {
                const width = 125 - level*10;
                const height = width/162*204;
                drawSprite.alien(sketch, this.scene.players[username].color.swatch, x <= 0, alpha/255, new Point(sketch.windowWidth, sketch.windowHeight).divide(2).add(new Point(x - width/2, 0)), width, height)
                if (x <= 0) {
                    x = -x + 100 - level*5;
                    level++;
                } else {
                    x *= -1;
                }
            }
        }
    }
}
