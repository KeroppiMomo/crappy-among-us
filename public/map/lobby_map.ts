import { Point } from "../point.js";
import { Images } from "../resources.js";
import { OptionsModal } from "./options_modal.js";
import {Wall, Interactable, GameMap} from "./map.js";
type p5 = any;

export class LobbyMap implements GameMap {
    walkWalls = [
        new Wall(new Point(-300, -200), new Point(-100, -300)),
        new Wall(new Point(-100, -300), new Point(100, -300)),
        new Wall(new Point(100, -300), new Point(300, -200)),
        new Wall(new Point(300, -200), new Point(300, 200)),
        new Wall(new Point(300, 200), new Point(250, 250)),
        new Wall(new Point(250, 250), new Point(-250, 250)),
        new Wall(new Point(-250, 250), new Point(-300, 200)),
        new Wall(new Point(-300, 200), new Point(-300, -200)),
    ];
    lightWalls = [
        new Wall(new Point(-300, -400), new Point(-100, -500)),
        new Wall(new Point(-100, -500), new Point(100, -500)),
        new Wall(new Point(100, -500), new Point(300, -400)),
        new Wall(new Point(300, -400), new Point(300, 200)),
        new Wall(new Point(300, 200), new Point(250, 250)),
        new Wall(new Point(250, 250), new Point(-250, 250)),
        new Wall(new Point(-250, 250), new Point(-300, 200)),
        new Wall(new Point(-300, 200), new Point(-300, -400)),
    ];
    interactables = [
        new Interactable(
            "customize",
            (scene) => new Point(0, 0).subtract(scene.players[scene.username].pos).norm() < 200,
            (sketch, screen, isInteractable) => {
                if (isInteractable) sketch.image(Images["customize_laptop_glow"], -57, -50, 114, 100);
                else sketch.image(Images["customize_laptop"], -57, -50, 114, 100);
            },
            (scene) => new OptionsModal(scene),
        ),
    ];
    preRender(sketch: p5) {
        sketch.fill(104, 107, 110);
        sketch.stroke(47, 52, 55);
        sketch.strokeWeight(10);
        sketch.beginShape();
        sketch.vertex(-300, -400);
        sketch.vertex(-100, -500);
        sketch.vertex(100, -500);
        sketch.vertex(300, -400);
        sketch.vertex(300, 200);
        sketch.vertex(250, 250);
        sketch.vertex(-250, 250);
        sketch.vertex(-300, 200);
        sketch.endShape(sketch.CLOSE);

        sketch.fill(88, 97, 102);
        sketch.stroke(47, 52, 55);
        sketch.strokeWeight(5);
        sketch.beginShape();
        sketch.vertex(-300, -200);
        sketch.vertex(-100, -300);
        sketch.vertex(100, -300);
        sketch.vertex(300, -200);
        sketch.vertex(300, 200);
        sketch.vertex(250, 250);
        sketch.vertex(-250, 250);
        sketch.vertex(-300, 200);
        sketch.endShape(sketch.CLOSE);

    }
}
