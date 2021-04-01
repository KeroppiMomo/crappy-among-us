import { Point } from "../point.js";
import { GameModal } from "./map.js";
type p5 = any;

export class NormalModal implements GameModal {
    removeModal?: () => void;

    /// Plays fly out animation and remove the modal.
    protected removeTask = (success: boolean) => {
        if (!this.flyOutTime) {
            this.onClose?.(success ?? false);
            this.flyOutTime = Date.now();
        }
    }
    blockKey = true;

    private flyInTime: number;
    private flyOutTime?: number;

    /// Specify the width of the content to get an appropiate scaling in `render`.
    protected contentWidth?: number;
    /// Specify the height of the content to get an appropiate scaling in `render`.
    protected contentHeight?: number;

    onClose?: (success: boolean) => void;

    protected onClosePressed?: () => void;
    protected enableFlyIn = true;

    protected enableCloseButton = true;
    protected enableEscClosing = true;

    constructor() {
        this.flyInTime = Date.now();
    }
    /// Call super.render to get the animation effects, close button and translation and scaling.
    render(sketch: p5) {
        if (this.enableFlyIn) {
            const FLY_IN_DURATION = 300;
            // Thank you https://easings.net/
            function easeOut(t: number) { return 1 - (1-t)*(1-t); }
            if (Date.now() - this.flyInTime! < FLY_IN_DURATION) {
                sketch.translate(0, sketch.windowHeight/2 * (1-easeOut((Date.now() - this.flyInTime) / FLY_IN_DURATION)));
            } else if (this.flyOutTime && Date.now() - this.flyOutTime < FLY_IN_DURATION) {
                const offset = sketch.windowHeight/2 * (1-easeOut(1 - (Date.now() - this.flyOutTime) / FLY_IN_DURATION));
                sketch.translate(0, offset);
            } else if (this.flyOutTime && Date.now() - this.flyOutTime >= FLY_IN_DURATION) {
                this.removeModal?.();
            }
        }

        if (this.contentWidth && this.contentHeight) {
            sketch.translate(sketch.windowWidth/2, sketch.windowHeight/2); // Take middle as origin
            sketch.scale(Math.min(sketch.windowWidth / this.contentWidth, sketch.windowHeight / this.contentHeight) * 0.8); // 0.8 is arbitrary

            if (this.enableCloseButton) {
                sketch.fill(255);
                sketch.stroke(160);
                sketch.strokeWeight(5);
                sketch.ellipse(-this.contentWidth/2 - 50, -this.contentHeight/2 + 50, 50);
                sketch.stroke(0);
                sketch.line(-this.contentWidth/2 - 60, -this.contentHeight/2 + 40, -this.contentWidth/2 - 40, -this.contentHeight/2 + 60);
                sketch.line(-this.contentWidth/2 - 40, -this.contentHeight/2 + 40, -this.contentWidth/2 - 60, -this.contentHeight/2 + 60);
            }
        }
    }

    /// Convert a position with respect to the screen (i.e. top-left (0,0)) to with respect to the modal, 
    /// with translation and scaling according to `contentHeight` and `contentHeight`.
    protected screenToModalPos(sketch: p5, screenPos: Point) {
        if (!(this.contentWidth && this.contentHeight)) return screenPos;
        const translate = new Point(sketch.windowWidth/2, sketch.windowHeight/2);
        const scalar = Math.min(sketch.windowWidth / this.contentWidth, sketch.windowHeight / this.contentHeight) * 0.8;
        return screenPos.subtract(translate).divide(scalar);
    }

    /// Call super.onMousePressed to check whether the close button is clicked.
    onMousePressed(sketch: p5) {
        if (!(this.contentWidth && this.contentHeight)) return;
        if (this.enableCloseButton && this.screenToModalPos(sketch, new Point(sketch.mouseX, sketch.mouseY)).subtract(new Point(-this.contentWidth/2 - 50, -this.contentHeight/2 + 50)).norm() < 25) {
            if (this.onClosePressed) this.onClosePressed?.();
            else this.removeTask(false);
        }
    }

    onMouseDragged(sketch: p5) {}
    onMouseReleased(sketch: p5) {}

    onKeyUp(keyCode: number) {}
    onKeyDown(keyCode: number) {
        if (this.enableEscClosing && keyCode == 27) {
            this.removeTask(false);
        }
    }
}
