import { Point } from "../point.js";
import { NormalModal } from "./normal_modal.js";
type p5 = any;

export class UploadTaskModal extends NormalModal {
    /// The text on the download/upload button.
    private buttonText: string;
    /// The text of location from which "files are copied".
    private fromText: string;
    /// The text of location to which "files are copied".
    private toText: string;
    constructor(buttonText: string, fromText: string, toText: string, onClose?: (success: boolean) => void) {
        super();
        this.buttonText = buttonText;
        this.fromText = fromText;
        this.toText = toText;
        this.contentWidth = 1000;
        this.contentHeight = 600;
        this.onClose = onClose;
    }

    /// -1 if not started, 0 - 100 if started
    private progress = -1;
    // Unix epoch of start time
    private startTime?: number;
    private estimatedTime?: string;

    blockKey = true;

    render(sketch: p5) {
        super.render(sketch);
        this.updateProgress();

        sketch.stroke(0);
        sketch.strokeWeight(5);
        sketch.fill(166, 165, 174);
        sketch.rect(-500, -300, 1000, 600, 20); // Outer grey rectangle
        sketch.fill(85, 115, 149);
        sketch.rect(-450, -250, 900, 450, 20); // Inner blue rectangle

        sketch.stroke(50);
        sketch.strokeWeight(5);
        sketch.line(-150, -75, 150, -75); // Line between left and right

        // Left
        sketch.fill(236, 213, 167);
        sketch.stroke(158, 130, 86);
        sketch.strokeWeight(5);
        sketch.rect(-350, -130, 200, 130);
        sketch.beginShape();
        sketch.vertex(-350, -130);
        sketch.vertex(-350, -150);
        sketch.vertex(-310, -150);
        sketch.vertex(-290, -130);
        sketch.endShape(sketch.CLOSE);
        sketch.stroke(0);
        sketch.strokeWeight(5);
        sketch.fill(255);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.textSize(32);
        sketch.text(this.fromText, -250, 30);

        // Right
        sketch.fill(236, 213, 167);
        sketch.stroke(158, 130, 86);
        sketch.strokeWeight(5);
        sketch.rect(150, -130, 200, 130);
        sketch.beginShape();
        sketch.vertex(150, -130);
        sketch.vertex(150, -150);
        sketch.vertex(190, -150);
        sketch.vertex(210, -130);
        sketch.endShape(sketch.CLOSE);
        sketch.stroke(0);
        sketch.strokeWeight(5);
        sketch.fill(255);
        sketch.textAlign(sketch.CENTER);
        sketch.textSize(32);
        sketch.text(this.toText, 250, 30);

        if (this.progress == -1) {
            // Download button
            sketch.stroke(50);
            sketch.fill(180);
            sketch.strokeWeight(5);
            sketch.rect(-80, 75, 160, 50);
            sketch.noStroke();
            sketch.fill(0);
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
            sketch.text(this.buttonText, 0, 100);
        } else {
            // Progress Bar
            sketch.fill(255);
            sketch.stroke(0);
            sketch.strokeWeight(3);
            sketch.rect(-300, 75, 500, 40, 15);
            sketch.fill(68, 140, 47);
            sketch.rect(-300, 75, 500/100*this.progress, 40, 15);
            sketch.textAlign(sketch.RIGHT, sketch.CENTER);
            sketch.fill(255);
            sketch.strokeWeight(5);
            sketch.text(`${this.progress.toFixed(0)}%`, 300, 95);

            // Estimated Time
            sketch.fill(255);
            sketch.stroke(0);
            sketch.strokeWeight(5);
            sketch.textAlign(sketch.LEFT, sketch.BOTTOM);
            sketch.textSize(40);
            sketch.text(this.estimatedTime, -350, 180);
        }

        sketch.resetMatrix(); // Reset translation and scaling
    }

    onMousePressed(sketch: p5) {
        super.onMousePressed(sketch);

        const mousePosUnderTransform = this.screenToModalPos(sketch, new Point(sketch.mouseX, sketch.mouseY));
        if (!this.startTime 
            && mousePosUnderTransform.x > -80 && mousePosUnderTransform.x < 80
            && mousePosUnderTransform.y > 75 && mousePosUnderTransform.y  < 125) {
            this.startTime = Date.now();
            this.progress = 0;
        }
    }

    private updateProgress() {
        if (!this.startTime) return;
        const time = Date.now() - this.startTime;
        if (time > 10000) {
            this.removeTask(true);
        } else if (time > 9000) {
            this.progress = 100;
            this.estimatedTime = "Completed";
        } else if (time > 8500) {
            this.progress = 100;
            this.estimatedTime = "Estimated Time: 0s";
        } else if (time > 5000) {
            this.progress = 75 + (time-5000)/3500*25;
            this.estimatedTime = "Estimated Time: " + ((8500-time)/1000).toFixed(0) + "s";
        } else if (time > 4300) {
            this.progress = 69;
            this.estimatedTime = "Estimated Time: 1h 39m 42s";
        } else if (time > 3000) {
            this.progress = 42;
            this.estimatedTime = "Estimated Time: 1h 41m 59s";
        } else if (time > 2200) {
            this.progress = 35;
            this.estimatedTime = "Estimated Time: 3h 5m 12s";
        } else if (time > 900) {
            this.progress = 19;
            this.estimatedTime = "Estimated Time: 7h 37m 18s";
        } else {
            this.progress = 0;
            this.estimatedTime = "Estimated Time: 13h 49m 17s";
        }
    }
}
