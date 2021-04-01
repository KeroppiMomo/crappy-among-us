import { Point } from "../point.js";
import { GameScene } from "../game_scene.js";
import {MapLocation} from "../game_task.js";
import { Images } from "../resources.js";
import { OptionsModal } from "./options_modal.js";
type p5 = any;

export class Wall {
    start: Point;
    end: Point;
    color?: number[];

    constructor(start: Point, end: Point, color?: number[]) {
        this.start = start;
        this.end = end;
        this.color = color;
    }
}
export class Interactable {
    buttonImageName: string;
    isInteractable: (scene: GameScene) => boolean;
    render: (sketch: p5, scene: GameScene, isInteractable: boolean) => void;
    onInteract: (scene: GameScene) => GameModal | void;

    constructor(buttonImage: string, isInteractable: (scene: GameScene) => boolean, render: (sketch: p5, scene: GameScene, isInteractable: boolean) => void, onInteract: (scene: GameScene) => void) {
        this.buttonImageName = buttonImage;
        this.isInteractable = isInteractable;
        this.render = render;
        this.onInteract = onInteract;
    }
}
export class TaskInteractable extends Interactable {
    position: Point;
    taskID: string;
    location: MapLocation;
    drawImage: (sketch: p5) => void;
    drawShape: (sketch: p5) => void;
    buildModal: (onClose: (success: boolean) => void) => GameModal;

    constructor(
        position: Point,
        taskID: string,
        location: MapLocation,
        drawImage: (sketch: p5) => void,
        drawShape: (sketch: p5) => void,
        buildModal: (onClose: (success: boolean) => void) => GameModal
    ) {
        super(
            "use",
            (scene) => scene.isTaskLocationCurrent(taskID, location) && position.subtract(scene.players[scene.username].pos).norm() < 100,
            (sketch, scene, isInteractable) => {
                drawImage(sketch);

                sketch.strokeWeight(5);
                if (scene.isTaskLocationCurrent(taskID, location)) sketch.stroke(255, 255, 0);
                else sketch.noStroke();
                if (isInteractable) sketch.fill(255, 255, 255, 120);
                else sketch.noFill();

                drawShape(sketch);
            },
            (scene) => {
                return buildModal((success: boolean) => {
                    if (success) scene.tasks.filter((task) => task.id === taskID)[0].noCompleted++;
                });
            }
        );
        this.position = position;
        this.taskID = taskID;
        this.location = location;
        this.drawImage = drawImage;
        this.drawShape = drawShape;
        this.buildModal = buildModal;
    }
}
export interface GameModal {
    blockKey: boolean;
    render(sketch: p5): void;
    onMousePressed?(sketch: p5): void;
    onMouseDragged?(sketch: p5): void;
    onMouseReleased?(sketch: p5): void;

    /// Only triggered when `blockKey` is true.
    onKeyDown?(keyCode: number): void;
    /// Only triggered when `blockKey` is true.
    onKeyUp?(keyCode: number): void;

    /// This should be set by the GameScene
    removeModal?: () => void;
}
export interface GameMap {
    /// Render before the players and interactables are rendered.
    preRender?(sketch: p5): void;
    lightWalls: Wall[];
    walkWalls: Wall[];
    interactables: Interactable[];
}


export * from "./main_map.js";
