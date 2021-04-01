import { Point } from "../point.js";
import { Fonts, Images } from "../resources.js";
import { NormalModal } from "./normal_modal.js";
type p5 = any;

export class SwipeCardTaskModal extends NormalModal {
    readonly CARD_WIDTH = 300;
    readonly CARD_HEIGHT = 186;

    private cardPos = new Point(0, 300);

    private displayedText = "PLEASE INSERT CARD";

    private inWalletTime?: number;
    private dragStartTime?: number;
    private dragStartMousePos?: Point;
    private dragMaxSpeed?: number;

    private failTime?: number;
    private successTime?: number;
    private attemptEndPos?: Point;

    constructor(onClose?: (success: boolean) => void) {
        super();
        this.contentWidth = 600;
        this.contentHeight = 800;
        this.onClose = onClose;
    }
    render(sketch: p5) {
        this.updateCardPos();
        super.render(sketch);

        // Background
        sketch.stroke(0);
        sketch.strokeWeight(5);
        sketch.fill(65);
        sketch.rect(-300, -400, 600, 800);

        // Scanner background
        sketch.noStroke();
        sketch.fill(20);
        sketch.rect(-300, -400, 600, 375);

        // Scanner bottom
        sketch.stroke(0);
        sketch.strokeWeight(7);
        sketch.fill(153);
        sketch.rect(-300, -125, 600, 100, 50, 0, 0, 0);
        sketch.noStroke();
        sketch.fill(54, 52, 56);
        sketch.rect(-300, -25, 600, 50);

        // Card
        sketch.image(Images["admin_card"], this.cardPos.x - this.CARD_WIDTH/2, this.cardPos.y - this.CARD_HEIGHT/2, this.CARD_WIDTH, this.CARD_HEIGHT);

        // Wallet
        sketch.stroke(0);
        sketch.strokeWeight(5);
        sketch.fill(127, 67, 49);
        sketch.rect(-300, 300, 600, 100);

        // Scanner Top
        sketch.stroke(0);
        sketch.strokeWeight(7);
        sketch.fill(153);
        sketch.rect(-300, -400, 600, 250, 0, 0, 0, 50);
        sketch.fill(37, 74, 58);
        sketch.stroke(0);
        sketch.strokeWeight(5);
        sketch.rect(-250, -375, 500, 50);
        sketch.fill(255);
        sketch.noStroke(0);
        sketch.textSize(28);
        sketch.textAlign(sketch.LEFT, sketch.CENTER);
        sketch.textFont(Fonts["seven_segment"]);
        sketch.text(this.displayedText, -240, -350);
        sketch.textFont("sans-serif");
    }

    updateCardPos() {
        function map(from1: number, from2: number, to1: number, to2: number, val: number) {
            return to1 + (to2-to1) * (val-from1) / (from2 - from1);
        }
        function mapEaseOut(from1: number, from2: number, to1: number, to2: number, val: number) {
            const t = (val-from1)/(from2-from1);
            return to1 + (1 - (1-t)*(1-t)) * (to2 - to1);
        }
        if (this.inWalletTime) {
            if (Date.now() - this.inWalletTime < 750) {
                this.cardPos = new Point(map(0, 750, 0, -300, Date.now() - this.inWalletTime), map(0, 750, 300, -150, Date.now() - this.inWalletTime));
            } else {
                this.cardPos = new Point(-300, -150);
                this.inWalletTime = undefined;
                this.displayedText = "PLEASE SWIPE READ";
            }
        } else if (this.successTime) {
            if (Date.now() - this.successTime < 750) {
                this.cardPos = new Point(map(0, 750, this.attemptEndPos!.x, 0, Date.now() - this.successTime), map(0, 750, this.attemptEndPos!.y, 300, Date.now() - this.successTime));
            } else {
                this.removeTask(true);
            }
        } else if (this.failTime) {
            if (Date.now() - this.failTime < 500) {
                this.cardPos = new Point(mapEaseOut(0, 500, this.attemptEndPos!.x, -300, Date.now() - this.failTime), -150);
            } else {
                this.cardPos = new Point(-300, -150);
                this.failTime = undefined;
            }
        }
    }

    onMousePressed(sketch: p5) {
        super.onMousePressed(sketch);
        const mousePosUnderTransform = this.screenToModalPos(sketch, new Point(sketch.mouseX, sketch.mouseY));
        if (this.cardPos.y == 300
            && mousePosUnderTransform.x > -this.CARD_WIDTH/2 && mousePosUnderTransform.x < this.CARD_WIDTH/2
            && mousePosUnderTransform.y > this.cardPos.y - this.CARD_HEIGHT/2 && mousePosUnderTransform.y < 300) {
            this.inWalletTime = Date.now();
        } else if (this.cardPos.y == -150 && this.cardPos.x == -300
                   && mousePosUnderTransform.y > this.cardPos.y - this.CARD_HEIGHT/2 && mousePosUnderTransform.y < this.cardPos.y + this.CARD_HEIGHT/2
                   && mousePosUnderTransform.x > this.cardPos.x - this.CARD_WIDTH/2 && mousePosUnderTransform.x < this.cardPos.x + this.CARD_WIDTH/2) {
            this.dragStartTime = Date.now();
            this.dragStartMousePos = mousePosUnderTransform;
            this.dragMaxSpeed = 0;
        }
    }

    onMouseDragged(sketch: p5) {
        super.onMouseDragged(sketch);
        const mousePosUnderTransform = this.screenToModalPos(sketch, new Point(sketch.mouseX, sketch.mouseY));
        if (this.dragStartMousePos) {
            const lastX = this.cardPos.x;
            const newX = Math.min(600, Math.max(0, mousePosUnderTransform.x - this.dragStartMousePos.x)) - 300;
            this.cardPos = new Point(newX, -150);
            this.dragMaxSpeed = Math.max(this.dragMaxSpeed!, (newX - lastX)*sketch.frameRate());
        }
    }

    onMouseReleased(sketch: p5) {
        super.onMouseReleased(sketch);
        if (this.dragStartMousePos) {
            // Condition for a successful swipe:
            // 1) Completed swip
            // 2) max speed < 3000
            // 3) Duration < 650
            const duration = Date.now() - this.dragStartTime!;
            let success = false;
            if (this.cardPos.x != 300) {
                this.displayedText = "BAD READ. TRY AGAIN.";
            } else if (this.dragMaxSpeed! >= 3000) {
                this.displayedText = "TOO FAST. TRY AGAIN.";
            } else if (duration >= 650) {
                this.displayedText = "TOO SLOW. TRY AGAIN.";
            } else {
                this.displayedText = "ACCEPTED. THANK YOU.";
                success = true;
            }

            if (success) {
                this.successTime = Date.now();
            } else {
                this.failTime = Date.now();
            }
            this.attemptEndPos = this.cardPos;

            this.dragStartTime = undefined;
            this.dragStartMousePos = undefined;
            this.dragMaxSpeed = undefined;
        }
    }
}
