import { Point } from "../point.js";
import { NormalModal } from "./normal_modal.js";
import {BackgroundView, RectangleView, Rect, Color} from "../view.js";
type p5 = any;

export class AlignEngineTaskModal extends NormalModal {

    constructor(onClose?: (success: boolean) => void) {
        super();
        this.contentWidth = 1000;
        this.contentHeight = 1000;
        this.onClose = onClose;
    }

    render(sketch: p5) {
        super.render(sketch);

        new RectangleView({
            rect: new Rect(-500, -500, 1000, 1000),
            stroke: Color.black,
            strokeWeight: 5,
            fill: new Color(174, 173, 173),
        }).render(sketch);
    }
}
