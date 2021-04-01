import { NormalModal } from "./normal_modal.js";
import {Point} from "../point.js";
import {MyWebSocket} from "../websocket.js";
type p5 = any;

export class EmergencyModal extends NormalModal {
    username: string;
    noRemainEmergency: number;

    constructor(username: string, noRemainEmergency: number) {
        super();
        this.username = username;
        this.noRemainEmergency = noRemainEmergency;
        this.contentWidth = 600;
        this.contentHeight = 600;
    }

    render(sketch: p5) {
        super.render(sketch);

        sketch.stroke(0);
        sketch.strokeWeight(5);
        sketch.fill(79, 124, 158);
        sketch.rect(-300, -300, 600, 600);

        sketch.stroke(0);
        sketch.strokeWeight(3);
        sketch.fill(255);
        sketch.textSize(30);
        sketch.textAlign(sketch.CENTER, sketch.BASELINE);
        sketch.text("Call Emergency Meeting?", 0, -200);
        
        sketch.textSize(30);
        sketch.text(`Crewmember ${this.username} has`, 0, 150);
        sketch.textSize(40);
        sketch.fill(255, 0, 0);
        sketch.text(this.noRemainEmergency.toString(), 0, 205);
        sketch.textSize(30);
        sketch.fill(255);
        sketch.text("emergency meetings left", 0, 250);

        sketch.stroke(0);
        sketch.strokeWeight(3);
        sketch.fill(112, 40, 44);
        sketch.beginShape();
        sketch.vertex(-150, -65);
        sketch.vertex(-150, 50);
        sketch.bezierVertex(-100, 110, 100, 110, 150, 50);
        sketch.vertex(150, -65);
        sketch.endShape();

        sketch.fill(172, 47, 39);
        sketch.ellipse(0, -65, 300, 150);
    }

    onMousePressed(sketch: p5) {
        super.onMousePressed(sketch);
        const mousePosUnderTransform = this.screenToModalPos(sketch, new Point(sketch.mouseX, sketch.mouseY));
        if (mousePosUnderTransform.x >= -150 && mousePosUnderTransform.x <= 150
            && mousePosUnderTransform.y >= -140 && mousePosUnderTransform.y <= 100) {
            if (this.noRemainEmergency > 0) {
                MyWebSocket.instance.send("callEmergency", {});
            }
        }
    }
}
