import { GameModal } from "./map.js";
import { AlienColor } from "../alien_colors.js";
import { GameScene } from "../game_scene.js";
import * as drawSprite from "../draw_sprite.js";
import {Point} from "../point.js";
type p5 = any;

export class MeetingCalledModal implements GameModal {
    removeModal?: () => void;
    blockKey = true;

    colors: { [username: string]: AlienColor };
    body: string | undefined;

    constructor(scene: GameScene, body: string | undefined) {
        this.colors = {};
        for (const username in scene.players) {
            this.colors[username] = scene.players[username].color;
        }
        this.body = body;
    }

    render(sketch: p5) {
        sketch.fill(196, 41, 28);
        sketch.noStroke();
        sketch.rect(0, sketch.windowHeight/2 - 200/2, sketch.windowWidth, 200);

        sketch.stroke(0);
        sketch.strokeWeight(3);
        sketch.fill(255);
        sketch.textSize(32);
        if (this.body === undefined) {
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
            sketch.text("Emergency Meeting", sketch.windowWidth/2, sketch.windowHeight/2);
        } else {
            sketch.textAlign(sketch.CENTER, sketch.BOTTOM);
            sketch.text("Dead Body Reported", sketch.windowWidth/2, sketch.windowHeight/2 - 40);
            drawSprite.dead(sketch, this.colors[this.body].swatch, 1, new Point(sketch.windowWidth/2, sketch.windowHeight/2).add(new Point(-100/2, -20)), 100, 100);
        }
    }
}
