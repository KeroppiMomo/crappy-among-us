import { Fonts, Images } from "./resources.js";
import { SceneController } from "./scene_controller.js";
type p5 = any;

// @ts-expect-error
const myp5 = new p5((sketch: p5) => {
    sketch.preload = () => {
        for (const img in Images) {
            Images[img] = sketch.loadImage(`res/${img}.png`);
        }
        for (const font in Fonts) {
            Fonts[font] = sketch.loadFont(`res/${font}.ttf`);
        }
    }
    sketch.setup = () => {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    }
    sketch.draw = () => {
        SceneController.instance.render(sketch);
    }
    sketch.windowResized = () => {
        SceneController.instance.onWindowResized(sketch.windowWidth, sketch.windowHeight);
        sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    }
    sketch.keyPressed = () => {
        SceneController.instance.onKeyDown(sketch.keyCode);
    }
    sketch.keyReleased = () => {
        SceneController.instance.onKeyUp(sketch.keyCode);
    }
    sketch.mousePressed = () => {
        SceneController.instance.onMousePressed(sketch);
    }
    sketch.mouseDragged = () => {
        SceneController.instance.onMouseDragged(sketch);
    }
    sketch.mouseReleased = () => {
        SceneController.instance.onMouseReleased(sketch);
    }
});

window.onbeforeunload = () => {
    SceneController.instance.unload();
};
