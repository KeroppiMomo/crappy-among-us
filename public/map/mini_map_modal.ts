import { GameModal, Wall, TaskInteractable } from "./map.js";
import {NormalModal} from "./normal_modal.js";
import {GameScene} from "../game_scene.js";
import {Point} from "../point.js";
import {Images} from "../resources.js";
import * as drawSprite from "../draw_sprite.js";
type p5 = any;

export class MiniMapModal extends NormalModal {
    blockKey = false;
    scene: GameScene;

    enableFlyIn = false;

    taskLocations: Point[] = [];

    constructor(scene: GameScene) {
        super();
        this.scene = scene;
        this.contentWidth = 1000;
        this.contentHeight = 600;

        for (const interactable of this.scene.map.interactables) {
            if (!(interactable instanceof TaskInteractable)) continue;
            const ti = interactable as TaskInteractable;
            if (!this.scene.isTaskLocationCurrent(ti.taskID, ti.location)) continue;
            this.taskLocations.push(ti.position);
        }
    }

    render(sketch: p5) {
        super.render(sketch);
        sketch.fill(255, 50, 50);

        const vertices = [
            new Point(1942.5, -55),
            new Point(1742.5, -55),
            new Point(1742.5, 110),
            new Point(1427.5, 110),
            new Point(1427.5, -45),
            new Point(1177.5, -45),
            new Point(1177.5, -120),
            new Point(1322.5, -120),
            new Point(1322.5, -505),
            new Point(1097.5, -730),
            new Point(847.5, -730),
            new Point(847.5, -510),
            new Point(612.5, -510),
            new Point(612.5, -670),
            new Point(317.5, -975),
            new Point(-347.5, -975),
            new Point(-552.5, -775),
            new Point(-552.5, -505),
            new Point(-1457.5, -505),
            new Point(-1457.5, -645),
            new Point(-1827.5, -645),
            new Point(-1952.5, -545),
            new Point(-1952.5, -395),
            new Point(-1562.5, -395),
            new Point(-1562.5, -315),
            new Point(-1807.5, -315),
            new Point(-1857.5, -265),
            new Point(-1952.5, -265),
            new Point(-1952.5, -30),
            new Point(-1742.5, -30),
            new Point(-1742.5, 175),
            new Point(-1917.5, 175),
            new Point(-1917.5, 10),
            new Point(-2082.5, 10),
            new Point(-2082.5, -170),
            new Point(-2182.5, -170),
            new Point(-2312.5, -55),
            new Point(-2312.5, 545),
            new Point(-2312.5, 670),
            new Point(-2182.5, 750),
            new Point(-2082.5, 750),
            new Point(-2082.5, 570),
            new Point(-1917.5, 570),
            new Point(-1917.5, 445),
            new Point(-1742.5, 445),
            new Point(-1742.5, 650),
            new Point(-1952.5, 650),
            new Point(-1952.5, 890),
            new Point(-1557.5, 890),
            new Point(-1557.5, 970),
            new Point(-1812.5, 970),
            new Point(-1852.5, 1020),
            new Point(-1942.5, 1020),
            new Point(-1942.5, 1170),
            new Point(-1827.5, 1265),
            new Point(-1457.5, 1265),
            new Point(-1457.5, 1095),
            new Point(-1237.5, 1095),
            new Point(-1237.5, 1390),
            new Point(-437.5, 1390),
            new Point(-437.5, 1430),
            new Point(-222.5, 1640),
            new Point(192.5, 1640),
            new Point(192.5, 1155),
            new Point(557.5, 1155),
            new Point(557.5, 1220),
            new Point(257.5, 1220),
            new Point(257.5, 1535),
            new Point(362.5, 1640),
            new Point(677.5, 1640),
            new Point(782.5, 1535),
            new Point(782.5, 1220),
            new Point(712.5, 1220),
            new Point(712.5, 1155),
            new Point(872.5, 1155),
            new Point(872.5, 1370),
            new Point(1102.5, 1370),
            new Point(1322.5, 1150),
            new Point(1322.5, 750),
            new Point(1162.5, 750),
            new Point(1162.5, 545),
            new Point(1427.5, 545),
            new Point(1427.5, 370),
            new Point(1742.5, 370),
            new Point(1742.5, 510),
            new Point(1942.5, 510),
            new Point(2112.5, 375),
            new Point(2112.5, 70),
        ];

        const leftInside = [
            new Point(-277.5, 660),
            new Point(-442.5, 795),
            new Point(-442.5, 1135),
            new Point(-837.5, 1135),
            new Point(-837.5, 1105),
            new Point(-682.5, 1105),
            new Point(-577.5, 1000),
            new Point(-577.5, 790),
            new Point(-457.5, 670),
            new Point(-457.5, 520),
            new Point(-962.5, 520),
            new Point(-962.5, 790),
            new Point(-962.5, 1135),
            new Point(-1107.5, 1135),
            new Point(-1107.5, 835),
            new Point(-1457.5, 835),
            new Point(-1457.5, 650),
            new Point(-1607.5, 650),
            new Point(-1607.5, 445),
            new Point(-1427.5, 445),
            new Point(-1427.5, 575),
            new Point(-1147.5, 575),
            new Point(-1147.5, 15),
            new Point(-1232.5, -65),
            new Point(-1322.5, -65),
            new Point(-1427.5, 40),
            new Point(-1427.5, 175),
            new Point(-1607.5, 175),
            new Point(-1607.5, -30),
            new Point(-1457.5, -30),
            new Point(-1457.5, -235),
            new Point(-952.5, -235),
            new Point(-952.5, -225),
            new Point(-1077.5, -225),
            new Point(-1077.5, 310),
            new Point(-992.5, 415),
            new Point(-437.5, 415),
            new Point(-437.5, 280),
            new Point(-627.5, 95),
            new Point(-627.5, -225),
            new Point(-777.5, -225),
            new Point(-777.5, -235),
            new Point(-552.5, -235),
            new Point(-552.5, 15),
            new Point(-297.5, 275),
            new Point(-42.5, 275),
            new Point(-42.5, 660),
        ];
        
        const rightInside = [
            new Point(1287.5, 295),
            new Point(1027.5, 295),
            new Point(1027.5, 750),
            new Point(872.5, 905),
            new Point(872.5, 945),
            new Point(192.5, 945),
            new Point(192.5, 660),
            new Point(92.5, 660),
            new Point(92.5, 610),
            new Point(307.5, 610),
            new Point(307.5, 885),
            new Point(742.5, 885),
            new Point(827.5, 795),
            new Point(827.5, 355),
            new Point(92.5, 355),
            new Point(92.5, 275),
            new Point(352.5, 275),
            new Point(612.5, 0),
            new Point(612.5, -245),
            new Point(847.5, -245),
            new Point(847.5, -185),
            new Point(912.5, -120),
            new Point(1017.5, -120),
            new Point(1017.5, -35),
            new Point(912.5, -35),
            new Point(912.5, -85),
            new Point(732.5, -85),
            new Point(732.5, -35),
            new Point(537.5, 160),
            new Point(537.5, 280),
            new Point(912.5, 280),
            new Point(912.5, 230),
            new Point(1287.5, 230),
        ];

        function vertexTransform(vertex: Point) {
            return vertex.divide(4).add(new Point(20, -85));
        }

        sketch.stroke(255, 230);
        sketch.strokeWeight(5);
        sketch.fill(188, 196, 237, 230);
        sketch.beginShape();
        for (const vertex of vertices) {
            sketch.vertex(vertexTransform(vertex).x, vertexTransform(vertex).y);
        }
        sketch.beginContour();
        for (const vertex of leftInside) {
            sketch.vertex(vertexTransform(vertex).x, vertexTransform(vertex).y);
        }
        sketch.endContour();
        sketch.beginContour();
        for (const vertex of rightInside) {
            sketch.vertex(vertexTransform(vertex).x, vertexTransform(vertex).y);
        }
        sketch.endContour();
        sketch.endShape(sketch.CLOSE);

        // Task locations
        for (const pos of this.taskLocations) {
            const transformed = vertexTransform(pos);
            sketch.fill(255, 255, 0, 150);
            sketch.stroke(100, 100, 0);
            sketch.strokeWeight(2);
            sketch.ellipse(transformed.x, transformed.y, 65);
        }

        // Player location
        const playerTransformed = vertexTransform(this.scene.players[this.scene.username].pos);
        drawSprite.alien(sketch, this.scene.players[this.scene.username].color.swatch, this.scene.players[this.scene.username].leftRight, 1, playerTransformed.subtract(new Point(40/2, 50)), 40, 50);
    }

    onMousePressed(sketch: p5) {
        super.onMousePressed(sketch);
        
        if (new Point(sketch.mouseX, sketch.mouseY).subtract(new Point(sketch.windowWidth - 50, 150)).norm() < 30) {
            this.removeModal?.();
        }
    }

    onClosePressed = () => {
        this.removeModal?.();
    };
}
