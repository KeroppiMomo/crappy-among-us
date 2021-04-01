import { LoadingScene } from "./loading_scene.js";
type p5 = any;

export interface Scene {
    onShow?(): void;
    onHide?(): void;
    render(sketch: p5): void;
    onWindowResized?(width: number, height: number): void;
    onKeyUp?(keyCode: number): void;
    onKeyDown?(keyCode: number): void;
    onMousePressed?(sketch: p5): void;
    onMouseDragged?(sketch: p5): void;
    onMouseReleased?(sketch: p5): void;
}

export class SceneController {
    private static _instance: SceneController;
    static get instance() {
        return this._instance || (this._instance = new SceneController());
    }

    sceneStack: Scene[];

    constructor() {
        this.sceneStack = [new LoadingScene()];
        this.sceneStack[0].onShow?.();
    }

    render(sketch: p5) {
        this.sceneStack[this.sceneStack.length-1].render(sketch);
    }

    onWindowResized(width: number, height: number) {
        this.sceneStack[this.sceneStack.length-1].onWindowResized?.(width, height);
    }

    onKeyUp(keyCode: number) {
        this.sceneStack[this.sceneStack.length-1].onKeyUp?.(keyCode);
    }
    onKeyDown(keyCode: number) {
        this.sceneStack[this.sceneStack.length-1].onKeyDown?.(keyCode);
    }

    onMousePressed(sketch: p5) {
        this.sceneStack[this.sceneStack.length-1].onMousePressed?.(sketch);
    }

    onMouseDragged(sketch: p5) {
        this.sceneStack[this.sceneStack.length-1].onMouseDragged?.(sketch);
    }

    onMouseReleased(sketch: p5) {
        this.sceneStack[this.sceneStack.length-1].onMouseReleased?.(sketch);
    }

    push(newScene: Scene) {
        this.sceneStack[this.sceneStack.length-1].onHide?.();
        this.sceneStack.push(newScene);
        newScene.onShow?.();
    }

    pop(scene: Scene) {
        const index = this.sceneStack.findIndex((s) => { return s === scene });
        if (index == this.sceneStack.length-1) {
            scene.onHide?.();
            if (index != 0) this.sceneStack[index-1].onShow?.();
        }
        this.sceneStack.splice(index, 1);
    }

    unload() {
        for (const scene of this.sceneStack.reverse()) {
            scene.onHide?.();
        }
    }

}
