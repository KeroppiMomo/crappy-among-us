import { Point } from "../point.js";
import { NormalModal } from "./normal_modal.js";
type p5 = any;

export class FixWireTaskModal extends NormalModal {
    ends = new Array<0 | 1 | 2 | 3>(4);
    connection = new Array<0 | 1 | 2 | 3 | undefined>(4);
    
    private readonly WIRE_COLORS = [
        [232, 50, 35],
        [249, 235, 80],
        [234, 61, 242],
        [32, 51, 244],
    ];

    dragWire?: 0 | 1 | 2 | 3;
    dragPos?: Point;

    constructor(onClose?: (success: boolean) => void) {
        super();
        this.ends = [0, 1, 2, 3];
        for (let i = 0; i < 4-1; ++i) {
            const j = Math.floor(Math.random() * (4 - i));
            const tmp = this.ends[i];
            this.ends[i] = this.ends[j];
            this.ends[j] = tmp;
        }
        
        this.onClose = onClose;
    }

    render(sketch: p5) {
        super.render(sketch);
        this.contentWidth = 600;
        this.contentHeight = 600;

        // Background
        sketch.stroke(0);
        sketch.strokeWeight(5);
        sketch.fill(21);
        sketch.rect(-300, -300, 600, 600);

        // Two gray sides
        sketch.fill(58, 61, 64);
        sketch.rect(-300, -300, 50, 600);
        sketch.rect(250, -300, 50, 600);

        for (let i = 0; i < 4; ++i) {
            const y = -300 + 600/5*(i+1);

            // Left side ends
            sketch.fill(218, 199, 67);
            sketch.rect(-300, y-20, 50, 20); // Light
            sketch.fill(this.WIRE_COLORS[i]);
            sketch.rect(-300, y, 60, 30);

            // Right side ends
            if (this.connection[this.ends[i]] == i) {
                sketch.fill(218, 199, 67);
            } else {
                sketch.fill(58, 61, 64);
            }
            sketch.rect(300, y-20, -50, 20);
            sketch.fill(this.WIRE_COLORS[this.ends[i]]);
            sketch.rect(300, y, -60, 30);
            sketch.fill(170, 74, 53);
            sketch.rect(240, y, -30, 30, 0, 20, 20, 0);
        }
        for (let i = 0; i < 4; ++i) {
            const y = -300 + 600/5*(i+1);

            // Wire
            sketch.fill(this.WIRE_COLORS[i]);
            let wireBegin = new Point(-240, y+15);
            let wireEnd = new Point(-240, y+15);
            if (this.connection[i] != undefined) {
                wireEnd = new Point(210, -300 + 600/5*(this.connection[i]!+1) + 15);
            } else if (this.dragWire == i) {
                wireEnd = this.dragPos!;
            }
            sketch.beginShape();
            sketch.vertex(wireBegin.x, wireBegin.y - 15);
            sketch.vertex(wireBegin.x, wireBegin.y + 15);
            sketch.vertex(wireEnd.x, wireEnd.y + 15);
            sketch.vertex(wireEnd.x, wireEnd.y - 15);
            sketch.endShape(sketch.CLOSE);

            sketch.fill(170, 74, 53);
            sketch.rect(wireEnd.x, wireEnd.y - 15, 30, 30, 0, 20, 20, 0);
        }
    }

    onMousePressed(sketch: p5) {
        super.onMousePressed(sketch);
        const mousePosUnderTransform = super.screenToModalPos(sketch, new Point(sketch.mouseX, sketch.mouseY));
        for (let i = 0; i < 4; ++i) {
            if (this.connection[i] == undefined) {
                const y = -300 + 600/5*(i+1);
                if (mousePosUnderTransform.x >= -240 && mousePosUnderTransform.x <= -210
                    && mousePosUnderTransform.y >= y && mousePosUnderTransform.y <= y+30) {
                    this.dragPos = mousePosUnderTransform;
                    this.dragWire = i as 0 | 1 | 2 | 3;
                }
            } else {
                const y = -300 + 600/5*(this.connection[i]!+1);
                if (mousePosUnderTransform.x >= 210 && mousePosUnderTransform.x <= 240
                    && mousePosUnderTransform.y >= y && mousePosUnderTransform.y <= y+30) {
                    this.dragPos = mousePosUnderTransform;
                    this.dragWire = i as 0 | 1 | 2 | 3;
                }
            }
        }
    }

    onMouseDragged(sketch: p5) {
        super.onMouseDragged(sketch);
        if (this.dragWire == undefined) return;

        const mousePosUnderTransform = super.screenToModalPos(sketch, new Point(sketch.mouseX, sketch.mouseY));
        this.dragPos = mousePosUnderTransform;
        let connected: 0|1|2|3|undefined = undefined;
        for (let i = 0; i < 4; ++i) {
            const y = -300 + 600/5*(i+1);
            if (mousePosUnderTransform.x >= 210  &&  mousePosUnderTransform.x <= 240
                && mousePosUnderTransform.y >= y && mousePosUnderTransform.y <= y+30) {
                connected = i as 0|1|2|3;
            }
        }
        this.connection[this.dragWire] = connected;
    }

    onMouseReleased(sketch: p5) {
        super.onMouseReleased(sketch);
        this.dragWire = undefined;
        this.dragPos = undefined;

        let completed = true;
        for (let i = 0; i < 4; ++i) {
            if (this.connection[i] == undefined || this.ends[this.connection[i]!] != i) {
                completed = false;
            }
        }

        if (completed) {
            this.removeTask(true);
        }
    }
}
