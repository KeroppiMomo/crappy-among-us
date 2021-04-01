import { Point } from "../point.js";
import { NormalModal } from "./normal_modal.js";
type p5 = any;

export class RefuelEngineTaskModal extends NormalModal {
    private isFilling = false;
    private fillProgress = 0;
    private isFull = false;

    constructor(onClose?: (success: boolean) => void) {
        super();

        this.contentWidth = 600;
        this.contentHeight = 600;
        this.onClose = onClose;
    }

    render(sketch: p5) {
        super.render(sketch);
        this.updateProgress(sketch);

        // Backgrounds
        sketch.stroke(0);
        sketch.strokeWeight(5);
        sketch.fill(85);
        sketch.rect(-300, -300, 400, 600);
        sketch.rect(150, 150, 150, 150);

        // Red cables
        sketch.fill(104, 31, 11);
        sketch.rect(100, 180, 50, 30);
        sketch.rect(100, 240, 50, 30);

        // Button
        sketch.fill(203);
        sketch.rect(187.5, 187.5, 75, 75);

        // Red Light (indicate whether it is filling)
        if (this.isFilling && !this.isFull) {
            sketch.fill(225, 81, 39);
        } else {
            sketch.fill(82, 11, 10);
        }
        sketch.rect(175, 120, 25, 30, 10, 10, 0, 0);

        // Green light (indicate whether it is full)
        if (this.isFull) {
            sketch.fill(109, 239, 73);
        } else {
            sketch.fill(33, 83, 21);
        }
        sketch.rect(250, 120, 25, 30, 10, 10, 0, 0);

        // Tube
        for (let i = 0; i < 4; ++i) {
            if (i == 0) {
                sketch.noStroke();
                sketch.fill(0);
            } else if (i == 1) {

                sketch.noStroke();
                sketch.fill(194, 172, 62);
                if (this.fillProgress*340 < 50) {
                    const angle = Math.asin((50 - this.fillProgress * 340)/50);
                    sketch.arc(-100, 120, 100, 100, angle, sketch.PI - angle, sketch.CHORD);
                } else {
                    sketch.arc(-100, 120, 100, 100, 0, sketch.PI);
                    // Offset by 5 because there is some space between arc and rect (idk why)
                    sketch.rect(-150, 125, 100, -(this.fillProgress * 340 - 50 + 5));
                }
        
                continue;
            } else if (i == 2) {
                sketch.strokeWeight(10);
                sketch.stroke(255, 0, 0);
                sketch.noFill();
            } else if (i == 3) {
                sketch.strokeWeight(5);
                sketch.stroke(255);
                sketch.noFill();
            }
            sketch.beginShape();
            sketch.vertex(-150, 120);
            sketch.vertex(-150, -170);
            sketch.vertex(-50, -170);
            sketch.vertex(-50, 120);
            sketch.endShape();
            sketch.arc(-100, 120, 100, 100, 0, sketch.PI);
        }

        // Dotted line scales
        sketch.strokeWeight(5);
        sketch.stroke(255);
        for (let i = 0; i < 6; ++i) {
            const y = i/6*(-170-110) + (110);
            // const y = i/4*(121.8-(-114.7)) + (-114.7);
            for (let j = 0; j < ((i%2 == 0) ? 5 : 3); ++j) {
                const x = -150 + 14*j;
                sketch.line(x, y, x + 7, y);
            }
        }
    }

    updateProgress(sketch: p5) {
        if (this.isFilling && !this.isFull) {
            this.fillProgress = Math.min(1.0, this.fillProgress + 1/2/sketch.frameRate());
            if (this.fillProgress >= 1.0) {
                this.isFull = true;
                setTimeout(() => {
                    this.removeTask(true);
                }, 500);
            }
        }
    }

    onMousePressed(sketch: p5) {
        super.onMousePressed(sketch);
        const mousePosUnderTransform = super.screenToModalPos(sketch, new Point(sketch.mouseX, sketch.mouseY));
        if (mousePosUnderTransform.x >= 187.5 && mousePosUnderTransform.x <= 187.5 + 75
            && mousePosUnderTransform.y >= 187.5 && mousePosUnderTransform.y <= 187.5 + 75) {
            this.isFilling = true;
        }
    }
    
    onMouseReleased(sketch: p5) {
        super.onMouseReleased(sketch);
        this.isFilling = false;
    }
}
