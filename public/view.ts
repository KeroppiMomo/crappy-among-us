import { Point } from "./point.js";

type p5 = any;
namespace p5 {
    export type Image = any;
    export type Graphics = any;
    export type Font = any;
}

export class Size {
    constructor(
        public width: number,
        public height: number,
    ) {}
}

export class Rect {
    constructor(
        public x: number,
        public y: number,
        public w: number,
        public h: number
    ) {}

    public get topLeft() { return new Point(this.x, this.y); }
    public get topRight() { return new Point(this.x + this.w, this.y); }
    public get bottomLeft() { return new Point(this.x, this.y + this.h); }
    public get bottomRight() { return new Point(this.x + this.w, this.y + this.h); }

    public get size() { return new Size(this.w, this.h); }

    public get x1() { return this.x; }
    public get x2() { return this.x + this.w; }
    public get y1() { return this.y; }
    public get y2() { return this.y + this.h; }

    public get midX() { return this.x + this.w/2; }
    public get midY() { return this.y + this.h/2; }

    static fromCorners(x1: number, y1: number, x2: number, y2: number): Rect;
    static fromCorners(topLeft: Point, bottomRight: Point): Rect;
    static fromCorners(arg1: any, arg2: any, arg3?: any, arg4?: any): Rect {
        if (arg1 instanceof Point && arg2 instanceof Point) {
            return new Rect(arg1.x, arg1.y, arg2.x - arg1.x, arg2.y - arg1.y);
        } else if (typeof arg1 == "number" && typeof arg2 == "number" && typeof arg3 == "number" && typeof arg4 == "number") {
            return new Rect(arg1, arg2, arg3 - arg1, arg4 - arg2);
        } else {
            throw new Error("Unknown overload");
        }
    }
    
    static fromSize(topLeft: Point, size: Size): Rect {
        return new Rect(topLeft.x, topLeft.y, size.width, size.height);
    }
}

/** Describe a color with opacity. */
export class Color {
    static readonly transparent = new Color(0, 0);
    static readonly black = new Color(0);
    static readonly white = new Color(255);

    r: number;
    g: number;
    b: number;
    a: number;

    /** Construct a `Color` with its greyscale value and an optional alpha value. */
    constructor(grey: number, alpha?: number);
    /** Construct a `Color` with its red, green and blue channel values, and an optional alpha value. */
    constructor(r: number, g: number, b: number, alpha?: number);
    constructor(...args: number[]) {
        if (args.length > 4 || args.length == 0) throw Error("Invalid number of arguments");
        if (args.length == 1) {
            this.r = this.g = this.b = args[0];
            this.a = 255;
        } else if (args.length == 2) {
            this.r = this.g = this.b = args[0];
            this.a = args[1];
        } else if (args.length == 3) {
            [ this.r, this.g, this.b ] = args;
            this.a = 255;
        } else {
            [ this.r, this.g, this.b, this.a ] = args;
        }
    }

    get fourColor() { return [ this.r, this.g, this.b, this.a ]; }

    withOpacity(opacity: number): Color {
        return new Color(this.r, this.g, this.b, this.a * opacity);
    }
}

/** A basic rendering object, which supports interaction with p5 rendering engine and mouse interactions. */
export class View {
    private _render: (sketch: p5) => void;
    private _hitTest: (mouse: Point) => boolean;
    private _onMousePressed?: (mouse: Point) => void;
    private _onMouseDragged?: (mouse: Point) => void;
    private _onMouseReleased?: (mouse: Point) => void;

    /** Construct a `View`. 
     * @param data.render Draw on a p5 canvas.
     * @param hitTest Given the mouse position, if the mouse hit the view, return true. Otherwise, return false.
     * @param onMousePressed Handler when mouse is pressed at a position.
     * @param onMouseDragged Handler when mouse is dragged to a position.
     * @param onMouseReleased Handler when mouse is released at a position.
     */
    constructor({ render, hitTest, onMousePressed, onMouseDragged, onMouseReleased }: {
        render: (sketch: p5) => void,
        hitTest: (mouse: Point) => boolean,
        onMousePressed?: (mouse: Point) => void,
        onMouseDragged?: (mouse: Point) => void,
        onMouseReleased?: (mouse: Point) => void,
    }) {
        this._render = render;
        this._hitTest = hitTest;
        this._onMousePressed = onMousePressed;
        this._onMouseDragged = onMouseDragged;
        this._onMouseReleased = onMouseReleased;
    }

    render(sketch: p5) { this._render(sketch); }
    hitTest(mouse: Point) { return this._hitTest(mouse); }
    onMousePressed(mouse: Point) { return this._onMousePressed?.(mouse); }
    onMouseDragged(mouse: Point) { return this._onMouseDragged?.(mouse); }
    onMouseReleased(mouse: Point) { return this._onMouseReleased?.(mouse); }
}

/** A `View` which its hit area is a rectangle. */
export class HitBoxView extends View {
    /** Construct a `HitBoxView`. 
     * @param child The child `View`. Note that `HitBoxView` does **not** pass mouse events to its child.
     * @param hitBox A `Rect` describing the hit box.
     * @param onMousePressed Handler when mouse is pressed at a position.
     * @param onMouseDragged Handler when mouse is dragged to a position.
     * @param onMouseReleased Handler when mouse is released at a position.
     */
    constructor({ child, hitBox, onMousePressed, onMouseDragged, onMouseReleased }: {
        child: View,
        hitBox: Rect,
        onMousePressed?: (mouse: Point) => void,
        onMouseDragged?: (mouse: Point) => void,
        onMouseReleased?: (mouse: Point) => void,
    }) {
        super({
            render: (sketch) => child.render(sketch),
            hitTest: (mouse: Point) => {
                return mouse.x >= hitBox.x1 && mouse.x <= hitBox.x2 && 
                    mouse.y >= hitBox.y1 && mouse.y <= hitBox.y2;
            },
            onMousePressed: onMousePressed,
            onMouseDragged: onMouseDragged,
            onMouseReleased: onMouseReleased,
        });
    }
}

/** A `View` that has no interaction with the mouse. Commonly used to bridge raw p5 drawing code and `View`-based rendering. */
export class NonInteratableView extends View {
    /** Constrct a `NonInteratableView`.
     * @param render Draw in a p5 canvas.
     */
    constructor({ render }: {
        render: (sketch: p5) => void,
    }) {
        super({
            render: render,
            hitTest: () => false,
        });
    }
}

/** A `View` that builds the underlying views. Similar to `NonInteratableView`. **/
export class BuilderView extends View {
    /** Construct a `BuilderView`.
      * @param builder Build the views.
      */
    constructor(builder: () => View) {
        const built = builder();
        super({
            render: (sketch: p5) => built.render(sketch),
            hitTest: (mouse) => built.hitTest(mouse),
            onMousePressed: (mouse) => built.onMousePressed(mouse),
            onMouseDragged: (mouse) => built.onMouseDragged(mouse),
            onMouseReleased: (mouse) => built.onMouseReleased(mouse),
        });
    }
}

/** A `View` that does not draw anything and accepts no mouse interactions. Commonly used as a placeholder. */
export class EmptyView extends NonInteratableView {
    constructor() {
        super({
            render: () => {},
        });
    }
}

/** A `View` which translates the coordinate system of its child by an offset. */
export class TranslatedView extends View {
    /** Construct a `TranslatedView`.
      * @param offset Offset of the translation.
      * @param child Child to be translated.
      */
    constructor({ offset, child }: {
        offset: Point,
        child: View,
    }) {
        super({
            render: (sketch: p5) => {
                sketch.push();
                sketch.translate(offset.x, offset.y);
                child.render(sketch);
                sketch.pop();
            },
            hitTest: (mouse: Point) => {
                return child.hitTest(mouse.subtract(offset));
            },
            onMousePressed: (mouse: Point) => {
                child.onMousePressed(mouse.subtract(offset));
            },
            onMouseDragged: (mouse: Point) => {
                child.onMouseDragged(mouse.subtract(offset));
            },
            onMouseReleased: (mouse: Point) => {
                child.onMouseReleased(mouse.subtract(offset));
            },
        });
    }
}

/** A `View` which scales the coordinate system of its child by scale factors. */
export class ScaledView extends View {
    /** Construct a `ScaledView`.
      * @param scale Scale factors. 
      * Dot product is used, i.e. the x component scales horizontally and the y component scales vertically.
      * If a number is given, horizontal and vertical directions have the same scale factor..
      * @param child Child to be translated.
      */
    constructor({ scale, child }: {
        scale: number | Point,
        child: View,
    }) {
        const factor = (scale instanceof Point) ? scale : new Point(scale, scale);
        super({
            render: (sketch: p5) => {
                sketch.push();
                sketch.scale(factor.x, factor.y);
                child.render(sketch);
                sketch.pop();
            },
            hitTest: (mouse: Point) => {
                return child.hitTest(new Point(mouse.x / factor.x, mouse.y / factor.y));
            },
            onMousePressed: (mouse: Point) => {
                child.onMousePressed(new Point(mouse.x / factor.x, mouse.y / factor.y));
            },
            onMouseDragged: (mouse: Point) => {
                child.onMouseDragged(new Point(mouse.x / factor.x, mouse.y / factor.y));
            },
            onMouseReleased: (mouse: Point) => {
                child.onMouseReleased(new Point(mouse.x / factor.x, mouse.y / factor.y));
            },
        });
    }
}

export class RotatedView extends View {
    constructor({ angle, child }: {
        angle: number,
        child: View,
    }) {
        function inv(mouse: Point) {
            // (a+bi)(cos x + i sin x) = a cos x + a sin x i + b cos x i - b sin x = (a cos x - b sin x) + (a sin x + b cos x) i
            return new Point(mouse.x * Math.cos(-angle) - mouse.y * Math.sin(-angle), mouse.x * Math.sin(-angle) + mouse.y * Math.cos(-angle));
        }
        super({
            render: (sketch: p5) => {
                sketch.push();
                sketch.rotate(angle);
                child.render(sketch);
                sketch.pop();
            },
            hitTest: (mouse: Point) => child.hitTest(inv(mouse)),
            onMousePressed: (mouse: Point) => child.onMousePressed(inv(mouse)),
            onMouseDragged: (mouse: Point) => child.onMouseDragged(inv(mouse)),
            onMouseReleased: (mouse: Point) => child.onMouseReleased(inv(mouse)),
        });
    }
}

/** A `View` which stacks multiple children `View`s on top of each other. */
export class StackView extends View {
    /** The child which the mouse is currently dragging. */
    private mouseOnChild?: View;

    /** Construct a `StackView`.
      * If `bottomUp` is true, then the first `children` is at the bottom, i.e. rendered first, and the last `children` is at the top, i.e. rendered last.
      * @param children Array of children `View`s to be rendered.
      * @param bottomUp If the children should be rendered from bottom up, return true. Otherwise, return false.
      */
    constructor({ children, bottomUp = true }: {
        children: View[],
        bottomUp?: boolean,
    }) {
        if (!bottomUp) children = children.reverse();
        super({
            render: (sketch: p5) => {
                for (const child of children) {
                    sketch.push();
                    child.render(sketch);
                    sketch.pop();
                }
            },
            hitTest: (mouse: Point) => {
                for (const child of children) {
                    if (child.hitTest(mouse)) return true;
                }
                return false;
            },
            onMousePressed: (mouse: Point) => {
                for (const child of children.reverse()) {
                    if (child.hitTest(mouse)) {
                        this.mouseOnChild = child;
                        break;
                    }
                }
                this.mouseOnChild?.onMousePressed(mouse);
            },
            onMouseDragged: (mouse: Point) => {
                this.mouseOnChild?.onMouseDragged(mouse);
            },
            onMouseReleased: (mouse: Point) => {
                this.mouseOnChild?.onMouseReleased(mouse);
                this.mouseOnChild = undefined;
            },
        });
    }
}

/** Conditionally render its children. */
export class IfView extends View {
    /** Construct an `IfView`.
      * @param condition The condition to render the children.
      * @param thenChild The child `View` rendered if the condition is satsifed.
      * @param elseChild The child `View` rendered if the condition is not satsifed.
      **/
    constructor({ condition, thenChild, elseChild }: {
        condition: boolean,
        thenChild: () => View,
        elseChild?: () => View
    }) {
        elseChild = elseChild || (() => new View({
            render: () => {},
            hitTest: () => false,
            onMousePressed: () => {},
            onMouseDragged: () => {},
            onMouseReleased: () => {},
        }));

        const child = condition ? thenChild() : elseChild();

        super({
            render: (sketch) => child.render(sketch),
            hitTest: (mouse) => child.hitTest(mouse),
            onMousePressed: (mouse) => child.onMousePressed(mouse),
            onMouseDragged: (mouse) => child.onMouseDragged(mouse),
            onMouseReleased: (mouse) => child.onMouseReleased(mouse),
        });
    }
}

declare global {
    interface ArrayConstructor {
        for<T>(init: () => T, condition: (cur: T) => boolean, increment: (old: T) => T): Array<T>;
    }
}

if (!Array.for) {
    Array.for = function<T>(init: () => T, condition: (cur: T) => boolean, increment: (old: T) => T) {
        let result: T[] = [];
        for (let data = init(); condition(data); data = increment(data)) {
            result.push(data);
        }

        return result;
    };
}

/** A `View` which paints the background color.
 * All rendering done before this view will be erased.
 **/
export class BackgroundView extends View {
    /** Construct a  `BackgroundView`.
      * @param color The background color.
      * @param child The child view.
      **/
    constructor({ color, child }: {
        color: Color
        child: View
    }) {
        super({
            render: (sketch: p5) => {
                sketch.background(...color.fourColor);
                child.render(sketch);
            },
            hitTest: child.hitTest,
            onMousePressed: child.onMousePressed,
            onMouseDragged: child.onMouseDragged,
            onMouseReleased: child.onMouseReleased,
        });
    }
}

/** A `View` which draws a rectangle. */
export class RectangleView extends NonInteratableView {
    /** Construct a `RectangleView`.
      * @param rect The rectangle to be drawn.
      * @param stroke Stroke color.
      * @param strokeWeight Stroke weight. Documentation is hard.
      * @param fill Fill color.
      **/
    constructor({ rect, stroke, strokeWeight, fill }: {
        rect: Rect,
        stroke: Color,
        strokeWeight: number,
        fill: Color,
    }) {
        super({
            render: (sketch: p5) => {
                sketch.push();
                sketch.stroke(...stroke.fourColor);
                sketch.strokeWeight(strokeWeight);
                sketch.fill(...fill.fourColor);
                sketch.rect(rect.x, rect.y, rect.w, rect.h);
                sketch.pop();
            },
        });
    }
}

/** A `View` which draws an ellipse. */
export class EllipseView extends NonInteratableView {
    /** Construct an `EllipseView`.
      * @param rect The rectangle in which the ellipse is inscribed.
      * @param stroke Stroke color.
      * @param strokeWeight Stroke weight. Documentation is hard.
      * @param fill Fill color.
      **/
    constructor({ rect, stroke, strokeWeight, fill }: {
        rect: Rect,
        stroke: Color,
        strokeWeight: number,
        fill: Color,
    }) {
        super({
            render: (sketch: p5) => {
                sketch.push();
                sketch.stroke(...stroke.fourColor);
                sketch.strokeWeight(strokeWeight);
                sketch.fill(...fill.fourColor);
                sketch.ellipse(rect.midX, rect.midY, rect.w, rect.h);
                sketch.pop();
            },
        });
    }
}

/** A `View` which renders an image. */
export class ImageView extends NonInteratableView {
    /** Construct an `ImageView`.
      * @param image Image to be rendered.
      * @param rect Rectgular area to fill with the image.
      **/
    constructor({ image, rect }: {
        image: p5.Image,
        rect: Rect,
    }) {
        super({
            render: (sketch: p5) => {
                sketch.push();
                sketch.image(image, rect.x, rect.y, rect.w, rect.h);
                sketch.pop();
            },
        });
    }
}

/** A `View` that renders text. */
export class TextView extends NonInteratableView {
    /** Construct a `TextView`.
      * @param text Text to be rendered.
      * @param pos Position of the text. The accurate position is determined by the alignment options `horizontalAlign` and `verticalAlign`.
      * @param font Font of the text. It can either be a `string` of a web safe font, or a `p5.Font` object.
      * @param horizontalAlign Horizontal alignment of the text, representing the location of `pos.x` relative to the text.
      * @param verticalAlign Vertical alignment of the text, representing the location of `pos.y` relative to the text.
      * @param fill Color inside the text.
      * @param stroke Color outside the text.
      * @param strokeWeight Weight of stroke outside the text.
      */
    constructor({ text, pos, font = "sans-serif", fontSize, horizontalAlign = "left", verticalAlign = "bottom", fill, stroke, strokeWeight }: {
        text: string,
        pos: Point,
        font?: string | p5.Font,
        fontSize: number,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "center" | "baseline" | "bottom",
        fill: Color,
        stroke: Color,
        strokeWeight: number,
    }) {
        super({ render: (sketch: p5) => {
            sketch.push();

            sketch.textFont(font);
            sketch.textSize(fontSize);
            sketch.textAlign({
                "left": sketch.LEFT,
                "center": sketch.CENTER,
                "right": sketch.RIGHT
            }[horizontalAlign],
            {
                "top": sketch.TOP,
                "center": sketch.CENTER,
                "baseline": sketch.BASELINE,
                "bottom": sketch.BOTTOM,
            }[verticalAlign]);
            sketch.fill(...fill.fourColor);
            sketch.stroke(...stroke.fourColor);
            sketch.strokeWeight(strokeWeight);

            sketch.text(text, pos.x, pos.y);
            
            sketch.pop();
        }});
    }
}

export interface Vertex {
    render(sketch: p5): void;
}
export class LineVertex implements Vertex {
    point: Point;

    constructor(x: number, y: number);
    constructor(point: Point);
    constructor(arg1: any, arg2?: any) {
        if (typeof arg1 == "number" && typeof arg2 == "number") {
            this.point = new Point(arg1, arg2);
        } else if (arg1 instanceof Point && arg2 === undefined) {
            this.point = arg1;
        } else {
            throw new Error("Unknown overload");
        }
    }

    render(sketch: p5) {
        sketch.vertex(this.point.x, this.point.y);
    }
}
export class BezierVertex implements Vertex {
    control1: Point;
    control2: Point;
    anchor2: Point;

    constructor(x2: number, y2: number, x3: number, y3: number, x4: number, y4: number);
    constructor(control1: Point, control2: Point, anchor2: Point);
    constructor(...args: any[]) {
        if (args.length === 3 && args.every((v: any) => v instanceof Point)) {
            [ this.control1, this.control2, this.anchor2 ] = args;
        } else if (args.length === 6 && args.every((v: any) => typeof v == "number")) {
            this.control1 = new Point(args[0], args[1]);
            this.control2 = new Point(args[2], args[3]);
            this.anchor2 = new Point(args[4], args[5]);
        } else {
            throw new Error("Unknown overload");
        }
    }

    render(sketch: p5) {
        sketch.bezierVertex(this.control1.x, this.control1.y, this.control2.x, this.control2.y, this.anchor2.x, this.anchor2.y);
    }
}

export class ShapeView extends NonInteratableView {
    constructor({ vertices, contour = [], stroke, strokeWeight, fill, closeShape = false }: {
        vertices: Vertex[],
        contour?: Vertex[],
        stroke: Color,
        strokeWeight: number,
        fill: Color,
        closeShape?: boolean,
    }) {
        super({ render: (sketch: p5) => {
            sketch.push();
            sketch.stroke(...stroke.fourColor);
            sketch.strokeWeight(strokeWeight);
            sketch.fill(...fill.fourColor);
            sketch.beginShape();
            vertices.forEach((vertex) => vertex.render(sketch));
            if (contour.length > 0) {
                sketch.beginContour();
                contour.forEach((vertex) => vertex.render(sketch));
                sketch.endContour();
            }
            if (closeShape) sketch.endShape(sketch.CLOSE);
            else sketch.endShape();
            sketch.pop();
        }});
    }
}

/** A `View` that creates a p5 canvas to render its child. Useful for layer rendering. **/
export class CanvasContextView extends NonInteratableView {
    private static contexts: { [id: string]: p5.Graphics } = {};

    /** Construct a  `CanvasContextView`.
      * @param rect Rectangle to render the context onto current canvas.
      * @param id Identifier of the context. 
      * If the ID is not seen before, a DOM canvas element is added and is attached with a p5 context.
      * To remove the context, pass the same ID to `CanvasContextView.removeContext`.
      * @param size Size of the context.
      * @param child Child of the context.
      **/
    constructor({ id, rect, size, child }: {
        rect: Rect,
        id: string,
        size: Size,
        child: View,
    }) {
        super({ render: (sketch: p5) => {
            if (id in CanvasContextView.contexts) {
                CanvasContextView.contexts[id].clear();
            } else {
                CanvasContextView.contexts[id] = sketch.createGraphics(size.width, size.height);
            }

            child.render(CanvasContextView.contexts[id]);

            sketch.image(CanvasContextView.contexts[id], rect.x, rect.y, rect.w, rect.h);
        }});
    }

    static removeContext(id: string) {
        delete CanvasContextView.contexts[id];
    }
}

/** A `View` that provides the p5 canvas to build the child. */
export class RequireContextView extends NonInteratableView {
    constructor({ builder }: {
        builder: (sketch: p5) => View,
    }) {
        super({
            render: (sketch: p5) => builder(sketch).render(sketch),
        });
    }
}

/** When rendered, this `View` erases contents in the canvas. */
export class EraseView extends NonInteratableView {
    constructor({ child }: {
        child: View
    }) {
        super({ render: (sketch: p5) => {
            sketch.erase();
            child.render(sketch);
            sketch.noErase();
        }});
    }
}

export class TintView extends View {
    constructor({ color, child }: {
        color: Color,
        child: View,
    }) {
        super({
            render: (sketch: p5) => {
                sketch.tint(...color.fourColor);
                child.render(sketch);
                sketch.noTint();
            },
            hitTest: (mouse: Point) => child.hitTest(mouse),
            onMousePressed: (mouse: Point) => child.onMousePressed(mouse),
            onMouseDragged: (mouse: Point) => child.onMouseDragged(mouse),
            onMouseReleased: (mouse: Point) => child.onMouseReleased(mouse),
        });
    }
}

