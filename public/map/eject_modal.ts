import { Point } from "../point.js";
import { NormalModal } from "./normal_modal.js";
import {AlienColor, AlienColorSwatch} from "../alien_colors.js";
import {GameScene} from "../game_scene.js";
import { GameModal } from "./map.js";
import * as drawSprite from "../draw_sprite.js";
type p5 = any;

export class EjectModal implements GameModal {
    removeModal?: () => void;
    blockKey = true;

    dots: {
        pos: Point,
        depth: number,
    }[] = [];

    private startTime: number;

    constructor(
        public username: string,
        public color: AlienColor | undefined,
        public confirm: boolean | undefined,
        public isTie: boolean,
        public noImpostorLeft: number
    ) {
        this.startTime = Date.now();
    }

    render(sketch: p5) {
        if (this.dots.length === 0) this.createDots(sketch.windowWidth, sketch.windowHeight);
        else this.updateDots(sketch.frameRate());

        const allOpacity = 1 - Math.min(1, Math.max(0, (Date.now() - this.startTime - 6000)/500));
        if (Date.now() - this.startTime > 6500) {
            this.removeModal?.();
        }

        sketch.fill(0, 255 * allOpacity);
        sketch.rect(0, 0, sketch.windowWidth, sketch.windowHeight);

        sketch.stroke(255, 255 * Math.min(1, (Date.now() - this.startTime)/500 * allOpacity));
        for (const dot of this.dots) {
            sketch.strokeWeight(dot.depth);
            sketch.point(dot.pos.x, dot.pos.y);
        }

        // Flying in space
        if (this.username !== "") {
            sketch.push();
            sketch.translate((Date.now() - this.startTime - 500) / 5000 * sketch.windowWidth, sketch.windowHeight/2);
            sketch.rotate((Date.now() - this.startTime) / 1500 * 2 * Math.PI);
            drawSprite.alien(sketch, this.color!.swatch, true, allOpacity, new Point(81, 102).multiply(-1/2), 81, 102);
            sketch.pop();
        }

        const topMessage: string = (() => {
            if (this.username === "") return "No one is ejected.";
            if (this.confirm === undefined) return `${this.username} is ejected.`;
            return `${this.username} was ${this.confirm ? "" : "not "}An Impostor.`;
        })();

        const subStrMessage = topMessage.substr(0, Math.floor(topMessage.length * Math.max(0, Math.min(1, (Date.now() - this.startTime - 1000)/2000))));

        sketch.fill(255, 255 * allOpacity);
        sketch.noStroke();
        sketch.textAlign(sketch.CENTER, sketch.BASELINE);
        sketch.textSize(35);
        sketch.text(subStrMessage, sketch.windowWidth/2, sketch.windowHeight/2 - 10);

        sketch.fill(255, 255 * Math.min(1, Math.max(0, (Date.now() - this.startTime - 4000)/500)) * allOpacity);
        sketch.text(`${this.noImpostorLeft} Impostor${this.noImpostorLeft === 1 ? "" : "s"} remain${this.noImpostorLeft === 1 ? "s" : ""}.`, sketch.windowWidth/2, sketch.windowHeight/2 + 40);
    }

    createDots(windowWidth: number, windowHeight: number) {
        for (let i = 0; i < windowWidth * windowHeight / 10000; ++i) {
            this.dots.push({
                pos: new Point(Math.random() * (windowWidth + 50) - 50, Math.random() * windowHeight),
                depth: Math.random() * 4 + 1,
            });
        }
    }

    updateDots(frameRate: number) {
        for (const dot of this.dots) {
            dot.pos = dot.pos.add(new Point(3, 0).multiply(dot.depth).divide(frameRate))
        }
    }
}
