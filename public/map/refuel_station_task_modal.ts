import { Point } from "../point.js";
import { NormalModal } from "./normal_modal.js";
type p5 = any;

export class RefuelStationTaskModal extends NormalModal {
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

        // Tank (Hang tight... long drawing code ahead!!! Why is this shape so complicated)
        // Progress and background
        sketch.noStroke();
        sketch.fill(0);
        sketch.rect(-275, -225, 300, 375);
        sketch.fill(194, 172, 62);
        sketch.rect(-275, 150, 300, -375*this.fillProgress);
        // Handle
        for (let i = 0; i < 2; ++i) {
            if (i == 0) {
                sketch.strokeWeight(10);
                sketch.stroke(255, 0, 0);
                sketch.fill(85);
            } else {
                sketch.strokeWeight(5);
                sketch.stroke(255);
                sketch.noFill();
            }
            sketch.beginShape();
            sketch.vertex(-49, -190);
            sketch.vertex(-145, -190);
            sketch.vertex(-155, -160);
            sketch.vertex(-39, -160);
            sketch.endShape(sketch.CLOSE);
        }
        // Ouside gray
        sketch.strokeCap(sketch.PROJECT);
        sketch.fill(85);
        sketch.stroke(85);
        sketch.strokeWeight(4); // sometimes it can't cover completely so have to use some stroke
        sketch.beginShape(); // Upper left triangle
        sketch.vertex(-265, -225);
        sketch.vertex(-275, -203.8);
        sketch.vertex(-275, -225);
        sketch.endShape(sketch.CLOSE);
        sketch.beginShape(); // Left side
        sketch.vertex(-275, -203.8);
        sketch.vertex(-251.7, -193.4);
        sketch.vertex(-220.3, -127.4);
        sketch.vertex(-228.2, -114.7);
        sketch.vertex(-228.2, 121.8);
        sketch.vertex(-195.8, 150);
        sketch.vertex(-275, 150);
        sketch.endShape(sketch.CLOSE);
        sketch.beginShape(); // Lower right triangle
        sketch.vertex(-9.2, 150);
        sketch.vertex(25, 123.6);
        sketch.vertex(25, 150);
        sketch.endShape(sketch.CLOSE);
        sketch.beginShape(); // Right side
        sketch.vertex(25, -114.7);
        sketch.vertex(-9.2, -150.4);
        sketch.vertex(-34.1, -202);
        sketch.vertex(-160, -202);
        sketch.vertex(-191.3, -159.2);
        sketch.vertex(-222.5, -210.0);
        sketch.vertex(-265, -225);
        sketch.vertex(25, -225);
        sketch.endShape();
        // Draw outer stroke
        sketch.strokeCap(sketch.ROUND);
        for (let i = 0; i < 2; ++i) {
            sketch.noFill();

            if (i == 0) {
                sketch.strokeWeight(10);
                sketch.stroke(255, 0, 0);
            } else {
                sketch.strokeWeight(5);
                sketch.stroke(255);
            }

            sketch.beginShape();
            sketch.vertex(-265, -225);
            sketch.vertex(-275, -203.8);
            sketch.vertex(-251.7, -193.4);
            sketch.vertex(-220.3, -127.4);
            sketch.vertex(-228.2, -114.7);
            sketch.vertex(-228.2, 121.8);
            sketch.vertex(-195.8, 150);
            sketch.vertex(-9.2, 150);
            sketch.vertex(25, 123.6);
            sketch.vertex(25, -114.7);
            sketch.vertex(-9.2, -150.4);
            sketch.vertex(-34.1, -202);
            sketch.vertex(-160, -202);
            sketch.vertex(-191.3, -159.2);
            sketch.vertex(-222.5, -210.0);
            sketch.endShape(sketch.CLOSE);
        }


        // Ok finish that stupid tank

        // Dotted line scales
        sketch.strokeWeight(5);
        sketch.stroke(255);
        for (let i = 0; i <= 4; ++i) {
            const y = i/4*(121.8-(-114.7)) + (-114.7);
            for (let j = 0; j < ((i%2 == 0) ? 6 : 3); ++j) {
                const x = -228.2 + 14*j;
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
