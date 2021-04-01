import { GameModal } from "./map.js";
import {AlienColor} from "../alien_colors.js";
import {Images} from "../resources.js";
import * as drawSprite from "../draw_sprite.js";
import {Point} from "../point.js";

type p5 = any;

export class KilledModal implements GameModal {
    removeModal?: () => void;
    blockKey = true;
    
    userColor: AlienColor;
    killerColor: AlienColor;
    killerUsername: string;

    constructor(data: {
        userColor: AlienColor,
        killerColor: AlienColor,
        killerUsername: string,
    }) {
        this.userColor = data.userColor;
        this.killerColor = data.killerColor;
        this.killerUsername = data.killerUsername;

        setTimeout(() => {
            this.removeModal?.();
        }, 2500);
    }

    render(sketch: p5) {
        sketch.fill(196, 41, 28);
        sketch.noStroke();
        sketch.rect(0, sketch.windowHeight/2 - 200/2, sketch.windowWidth, 200);

        const message = `${this.killerUsername} has killed you`;

        sketch.stroke(0);
        sketch.strokeWeight(3);
        sketch.fill(255);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.textSize(32);
        sketch.text(message, sketch.windowWidth/2, sketch.windowHeight/2);

        const textWidth: number = sketch.textWidth(message);

        drawSprite.alien(sketch, this.killerColor.swatch, true, 1, new Point(sketch.windowWidth, sketch.windowHeight).divide(2).subtract(new Point(textWidth/2 + 79 + 50, 100/2)), 79, 100);
        drawSprite.alien(sketch, this.userColor.swatch, false, 1, new Point(sketch.windowWidth, sketch.windowHeight).divide(2).add(new Point(textWidth/2 + 50, -100/2)), 79, 100);
    }
}
