import { Point } from "./point.js";
import { AlienColorSwatch } from "./alien_colors.js";
import { Rect, NonInteratableView, TranslatedView, ScaledView, View, ShapeView, Color, LineVertex, BezierVertex, StackView, EllipseView } from "./view.js";
type p5 = any;

export class AlienView extends NonInteratableView {
    constructor({ rect, swatch, leftRight = true, opacity = 1.0 }: {
        rect: Rect,
        swatch: AlienColorSwatch,
        leftRight: boolean,
        opacity: number,
    }) {
        super({ render: (sketch: p5) => {
            new TranslatedView({
                offset: rect.topLeft.add(new Point(leftRight ? rect.w : 0, 0)),
                child: new ScaledView({
                    scale: new Point(rect.w/162*(leftRight ? -1 : 1), rect.h/204),
                    child: this.build(swatch, opacity),
                }),
            }).render(sketch);
        }});
    }

    private build(swatch: AlienColorSwatch, opacity: number): View {
        function buildFace(stroke: Color, strokeWeight: number, fill: Color): View {
            return new ShapeView({
                stroke: stroke,
                strokeWeight: strokeWeight,
                fill: fill,
                vertices: [
                    new LineVertex(15, 65),
                    new BezierVertex(15, 70, 16, 75, 22, 79),
                    new BezierVertex(30, 83, 76.3, 99.4, 87, 75),
                    new BezierVertex(93, 63, 92, 50, 89, 44),
                    new BezierVertex(83, 34, 57, 36, 41, 36),
                    new BezierVertex(31, 36, 13, 51, 15, 65),
                ],
            });
        }

        function buildUpperFace(stroke: Color, strokeWeight: number, fill: Color): View {
            return new ShapeView({
                stroke: stroke,
                strokeWeight: strokeWeight,
                fill: fill,
                closeShape: true,
                vertices: [
                    new LineVertex(20, 60),
                    new BezierVertex(24, 64, 31, 66, 39, 66),
                    new LineVertex(64, 67),
                    new BezierVertex(69, 67, 76, 62, 78, 56),
                    new BezierVertex(79, 50, 80, 47, 82, 45),
                    new LineVertex(82, 39),
                    new LineVertex(56, 36),
                    new LineVertex(26, 40),
                ],
            });
        }

        function buildLightFace(stroke: Color, strokeWeight: number, fill: Color): View {
            return new ShapeView({
                stroke: stroke,
                strokeWeight: strokeWeight,
                fill: fill,
                vertices: [
                    new LineVertex(33, 56),
                    new BezierVertex(41, 56, 56, 55, 59, 53),
                    new BezierVertex(61, 52, 63, 49, 60, 45),
                    new BezierVertex(56, 42, 45, 43, 39, 45),
                    new BezierVertex(29, 47, 26, 55, 33, 56),
                ],
            });
        }

        function buildBody(stroke: Color, strokeWeight: number, fill: Color): View {
            return new ShapeView({
                stroke: stroke,
                strokeWeight: strokeWeight,
                fill: fill,
                vertices: [
                    new LineVertex(23, 79),
                    new BezierVertex(23, 90, 21, 102, 21, 111),
                    new BezierVertex(22, 135, 27, 171, 31, 178),
                    new BezierVertex(35, 185, 53, 182, 58, 181),
                    new BezierVertex(65, 178, 67, 171, 63, 154),
                    new LineVertex(81, 153),
                    new BezierVertex(81, 166, 81, 176, 83, 181),
                    new BezierVertex(93, 196, 115, 191, 120, 183),
                    new BezierVertex(125, 171, 133, 54, 111, 18),
                    new BezierVertex(95, 0, 46, 3, 31, 38),
                ],
            });
        }

        function buildUpperBody(stroke: Color, strokeWeight: number, fill: Color): View {
            return new ShapeView({
                stroke: stroke,
                strokeWeight: strokeWeight,
                fill: fill,
                closeShape: true,
                vertices: [
                    new LineVertex(28, 90),
                    new BezierVertex(33, 133, 41, 129, 53, 132),
                    new BezierVertex(112, 140, 116, 94, 109, 31),
                    new BezierVertex(109, 25, 112, 26, 112, 24),
                    new LineVertex(101, 10),
                    new LineVertex(51, 14),
                    new LineVertex(30, 39),
                ],
            });
        }

        function buildBackpack(stroke: Color, strokeWeight: number, fill: Color): View {
            return new ShapeView({
                stroke: stroke,
                strokeWeight: strokeWeight,
                fill: fill,
                vertices: [
                    new LineVertex(123, 60),
                    new BezierVertex(129, 60, 141, 59, 148, 65),
                    new BezierVertex(154, 71, 153, 104, 153, 115),
                    new BezierVertex(155, 146, 145, 156, 125, 150),
                ],
            });
        }

        function buildUpperBackpack(stroke: Color, strokeWeight: number, fill: Color): View {
            return new ShapeView({
                stroke: stroke,
                strokeWeight: strokeWeight,
                fill: fill,
                closeShape: true,
                vertices: [
                    new LineVertex(129, 79),
                    new BezierVertex(136, 77, 141, 79, 147, 83),
                    new LineVertex(149, 65),
                    new LineVertex(126, 61),
                ],
            });
        }

        return new StackView({
            children: [
                buildBackpack(Color.transparent, 0, swatch.shadow.withOpacity(opacity)),
                buildUpperBackpack(Color.transparent, 0, swatch.primary.withOpacity(opacity)),
                buildBackpack(Color.black.withOpacity(opacity), 10, Color.transparent),
                new EllipseView({
                    stroke: Color.transparent,
                    strokeWeight: 0,
                    fill: new Color(0, 125).withOpacity(opacity),
                    rect: new Rect(10, 175.5, 134, 27),
                }),
                buildBody(Color.transparent, 0, swatch.shadow.withOpacity(opacity)),
                buildUpperBody(Color.transparent, 0, swatch.primary.withOpacity(opacity)),
                buildBody(Color.black.withOpacity(opacity), 10, Color.transparent),
                buildFace(Color.transparent, 0, new Color(80, 98, 106).withOpacity(opacity)),
                buildUpperFace(Color.transparent, 0, new Color(159, 201, 218).withOpacity(opacity)),
                buildLightFace(Color.transparent, 0, Color.white.withOpacity(opacity)),
                buildFace(Color.black.withOpacity(opacity), 10, Color.transparent),
            ],
        });
    }
}

export function alien(sketch: p5, swatch: AlienColorSwatch, leftRight: boolean, opacity: number, topLeft: Point, width: number, height: number) {
    new AlienView({
        rect: new Rect(topLeft.x, topLeft.y, width, height),
        swatch: swatch,
        leftRight: leftRight,
        opacity: opacity,
    }).render(sketch);

    return;

    sketch.push();

    sketch.translate(topLeft.x + (leftRight ? width : 0), topLeft.y);
    sketch.scale(width/162*(leftRight ? -1 : 1), height/204);

    function shapeFace() {
        sketch.beginShape();
        sketch.vertex(15, 65);
        sketch.bezierVertex(15, 70, 16, 75, 22, 79);
        sketch.bezierVertex(30, 83, 76.3, 99.4, 87, 75);
        sketch.bezierVertex(93, 63, 92, 50, 89, 44);
        sketch.bezierVertex(83, 34, 57, 36, 41, 36);
        sketch.bezierVertex(31, 36, 13, 51, 15, 65);
        sketch.endShape();
    }

    function shapeUpperFace() {
        sketch.beginShape();
        sketch.vertex(20, 60);
        sketch.bezierVertex(24, 64, 31, 66, 39, 66);
        sketch.vertex(64, 67);
        sketch.bezierVertex(69, 67, 76, 62, 78, 56);
        sketch.bezierVertex(79, 50, 80, 47, 82, 45);
        sketch.vertex(82, 39);
        sketch.vertex(56, 36);
        sketch.vertex(26, 40);
        sketch.endShape(sketch.CLOSE);
    }

    function shapeLightFace() {
        sketch.beginShape();
        sketch.vertex(33, 56);
        sketch.bezierVertex(41, 56, 56, 55, 59, 53);
        sketch.bezierVertex(61, 52, 63, 49, 60, 45);
        sketch.bezierVertex(56, 42, 45, 43, 39, 45);
        sketch.bezierVertex(29, 47, 26, 55, 33, 56);
        sketch.endShape();
    }

    function shapeBody() {
        sketch.beginShape();
        sketch.vertex(23, 79)
        sketch.bezierVertex(23, 90, 21, 102, 21, 111);
        sketch.bezierVertex(22, 135, 27, 171, 31, 178);
        sketch.bezierVertex(35, 185, 53, 182, 58, 181);
        sketch.bezierVertex(65, 178, 67, 171, 63, 154);
        sketch.vertex(81, 153);
        sketch.bezierVertex(81, 166, 81, 176, 83, 181);
        sketch.bezierVertex(93, 196, 115, 191, 120, 183);
        sketch.bezierVertex(125, 171, 133, 54, 111, 18);
        sketch.bezierVertex(95, 0, 46, 3, 31, 38);
        sketch.endShape();
    }

    function shapeUpperBody() {
        sketch.beginShape();
        sketch.vertex(28, 90);
        sketch.bezierVertex(33, 133, 41, 129, 53, 132);
        sketch.bezierVertex(112, 140, 116, 94, 109, 31);
        sketch.bezierVertex(109, 25, 112, 26, 112, 24);
        sketch.vertex(101, 10);
        sketch.vertex(51, 14);
        sketch.vertex(30, 39);
        sketch.endShape(sketch.CLOSE);
    }

    function shapeBackpack() {
        sketch.beginShape();
        sketch.vertex(123, 60);
        sketch.bezierVertex(129, 60, 141, 59, 148, 65);
        sketch.bezierVertex(154, 71, 153, 104, 153, 115);
        sketch.bezierVertex(155, 146, 145, 156, 125, 150);
        sketch.endShape();
    }

    function shapeUpperBackpack() {
        sketch.beginShape();
        sketch.vertex(129, 79);
        sketch.bezierVertex(136, 77, 141, 79, 147, 83);
        sketch.vertex(149, 65);
        sketch.vertex(126, 61);
        sketch.endShape(sketch.CLOSE);
    }

    sketch.noStroke();
    sketch.fill(...swatch.shadow.withOpacity(opacity).fourColor);
    shapeBackpack();

    sketch.noStroke();
    sketch.fill(...swatch.primary.withOpacity(opacity).fourColor);
    shapeUpperBackpack();

    sketch.noFill();
    sketch.strokeWeight(10);
    sketch.stroke(0, opacity*255);
    shapeBackpack();

    sketch.noStroke();
    sketch.fill(0, 125*opacity);
    sketch.ellipse(77, 189, 134, 27);

    sketch.noStroke();
    sketch.fill(...swatch.shadow.withOpacity(opacity).fourColor);
    shapeBody();

    sketch.noStroke();
    sketch.fill(...swatch.primary.withOpacity(opacity).fourColor);
    shapeUpperBody();

    sketch.strokeWeight(10);
    sketch.stroke(0, opacity*255);
    sketch.noFill();
    shapeBody();

    sketch.noStroke();
    sketch.fill(80, 98, 106, opacity*255);
    shapeFace();

    sketch.noStroke();
    sketch.fill(159, 201, 218, opacity*255);
    shapeUpperFace();

    sketch.noStroke();
    sketch.fill(255, opacity*255);
    shapeLightFace();

    sketch.strokeWeight(10);
    sketch.stroke(0, opacity*255);
    sketch.noFill();
    shapeFace();

    sketch.pop();
}

export class DeadAlienView extends NonInteratableView {
    constructor({ rect, swatch, opacity = 1.0 }: {
        rect: Rect,
        swatch: AlienColorSwatch,
        opacity: number,
    }) {
        super({ render: (sketch: p5) => {
            new TranslatedView({
                offset: rect.topLeft,
                child: new ScaledView({
                    scale: new Point(rect.w/92, rect.h/92),
                    child: this.build(swatch, opacity),
                }),
            }).render(sketch);
        }});
    }

    private build(swatch: AlienColorSwatch, opacity: number): View {
        function buildUp(stroke: Color, strokeWeight: number, fill: Color) {
            return new ShapeView({
                stroke: stroke,
                strokeWeight: strokeWeight,
                fill: fill,
                vertices: [
                    new LineVertex(13.4, 39.2),
                    new BezierVertex(5.8, 20.4, 17.8, 18.4, 27.6, 11),
                    new BezierVertex(59, -5, 83.8, 14.6, 63, 33.6),
                    new LineVertex(40.6, 38.6),
                ],
            });
        }

        function buildUpLight(stroke: Color, strokeWeight: number, fill: Color) {
            return new ShapeView({
                stroke: stroke,
                strokeWeight: strokeWeight,
                fill: fill,
                vertices: [
                    new LineVertex(14.8, 24.4),
                    new BezierVertex(24.2, 25.6, 22.4, 23.2, 27.6, 22.2),
                    new BezierVertex(32.4, 21, 28.6, 20.2, 58.6, 20.4),
                    new BezierVertex(60, 17.6, 62.2, 13.8, 66.8, 13),
                    new LineVertex(56, 6.4),
                    new LineVertex(29.4, 9.8),
                    new LineVertex(18.2, 16.8),
                ],
            });
        }

        function buildRight(stroke: Color, strokeWeight: number, fill: Color) {
            return new ShapeView({
                stroke: stroke,
                strokeWeight: strokeWeight,
                fill: fill,
                vertices: [
                    new LineVertex(70.2, 24.6),
                    new BezierVertex(81, 22.2, 89.6, 27.8, 88.6, 40.2),
                    new BezierVertex(87, 55.8, 80, 60.4, 70, 71),
                    new LineVertex(59, 38.6),
                ],
            });
        }

        function buildBody(stroke: Color, strokeWeight: number, fill: Color) {
            return new ShapeView({
                stroke: stroke,
                strokeWeight: strokeWeight,
                fill: fill,
                vertices: [
                    new LineVertex(5.2, 65.2),
                    new BezierVertex(2, 37.8, 36.2, 30, 43.4, 30.6),
                    new BezierVertex(76.4, 29.2, 78.4, 53.4, 72.6, 67),
                    new BezierVertex(70.8, 73.4, 60.8, 84.2, 45.6, 84),
                    new BezierVertex(34.6, 84.6, 5.4, 75.4, 5.2, 65.2),
                ],
            });
        }

        function buildInside(stroke: Color, strokeWeight: number, fill: Color) {
            return new ShapeView({
                stroke: stroke,
                strokeWeight: strokeWeight,
                fill: fill,
                vertices: [
                    new LineVertex(17.6, 55.4),
                    new BezierVertex(17.2, 46.6, 30, 41.2, 39.8, 41.8),
                    new BezierVertex(55.8, 41.4, 63.8, 48.6, 63.6, 58),
                    new BezierVertex(61.4, 72, 61.2, 73.6, 45.6, 73.6),
                    new LineVertex(23.4, 68),
                ],
            });
        }

        function buildBone(stroke: Color, strokeWeight: number, fill: Color) {
            return new ShapeView({
                stroke: stroke,
                strokeWeight: strokeWeight,
                fill: fill,
                vertices: [
                    new LineVertex(25.8, 57.2),
                    new BezierVertex(42.6, 42, 54.4, 59, 41, 63),
                    new BezierVertex(42.2, 64.6, 49.2, 80.8, 35.2, 82),
                    new BezierVertex(22.8, 81.4, 21.8, 76, 24.8, 69.2),
                    new BezierVertex(19, 79.6, 9.4, 74, 10.6, 67.6),
                    new BezierVertex(11.8, 56.6, 17.4, 55.6, 25.8, 57.2),
                ],
            });
        }

        function buildBoneMiddle(stroke: Color, strokeWeight: number, fill: Color) {
            return new ShapeView({
                stroke: stroke,
                strokeWeight: strokeWeight,
                fill: fill,
                vertices: [
                    new LineVertex(22.2, 68),
                    new BezierVertex(23.8, 64.4, 25, 63.2, 28.2, 63.8),
                    new BezierVertex(26, 67.2, 28.6, 69, 27.4, 70.6),
                ],
            });
        }

        function buildBoneShadow(stroke: Color, strokeWeight: number, fill: Color) {
            return new ShapeView({
                stroke: stroke,
                strokeWeight: strokeWeight,
                fill: fill,
                vertices: [
                    new LineVertex(13.8, 64.8),
                    new BezierVertex(13.8, 66.8, 19.2, 67, 22.6, 66.2),
                    new LineVertex(28.6, 65.4),
                    new BezierVertex(31.4, 65, 29.4, 68.6, 29.4, 71.2),
                    new BezierVertex(37.8, 72.6, 40.8, 70, 39.8, 65.6),
                    new LineVertex(39, 61.2),
                    new LineVertex(43.6, 57),
                    new LineVertex(46.8, 56.8),
                    new LineVertex(42.2, 63.4),
                    new LineVertex(46.2, 71.2),
                    new LineVertex(40.2, 82.4),
                    new LineVertex(15, 76.4),
                    new LineVertex(11, 70.6),
                ],
            });
        }

        return new StackView({ children: [
            buildRight(Color.black, 7, swatch.shadow.withOpacity(opacity)),
            buildUp(Color.transparent, 0, swatch.shadow.withOpacity(opacity)),
            buildUpLight(Color.transparent, 0, swatch.primary.withOpacity(opacity)),
            buildUp(Color.black, 7, Color.transparent),
            buildBody(Color.black, 7, swatch.shadow.withOpacity(opacity)),
            buildInside(Color.black, 4.5, swatch.inside.withOpacity(opacity)),
            buildBone(Color.transparent, 0, Color.white.withOpacity(opacity)),
            buildBoneShadow(Color.transparent, 0, new Color(125).withOpacity(opacity)),
            buildBoneMiddle(Color.transparent, 0, Color.black.withOpacity(opacity)),
            buildBone(Color.black, 6, Color.transparent),
        ]});
    }
}

export function dead(sketch: p5, swatch: AlienColorSwatch, opacity: number, topLeft: Point, width: number, height: number) {
    new DeadAlienView({
        rect: new Rect(topLeft.x, topLeft.y, width, height),
        swatch: swatch,
        opacity: opacity,
    }).render(sketch);

    return;

    sketch.push();

    sketch.translate(topLeft.x, topLeft.y);
    sketch.scale(width/92, height/92);

    function shapeUp() {
        sketch.beginShape();
        sketch.vertex(13.4, 39.2);
        sketch.bezierVertex(5.8, 20.4, 17.8, 18.4, 27.6, 11);
        sketch.bezierVertex(59, -5, 83.8, 14.6, 63, 33.6);
        sketch.vertex(40.6, 38.6);
        sketch.endShape(sketch.CLOSE);
    }

    function shapeUpLight() {
        sketch.beginShape();
        sketch.vertex(14.8, 24.4);
        sketch.bezierVertex(24.2, 25.6, 22.4, 23.2, 27.6, 22.2);
        sketch.bezierVertex(32.4, 21, 28.6, 20.2, 58.6, 20.4);
        sketch.bezierVertex(60, 17.6, 62.2, 13.8, 66.8, 13);
        sketch.vertex(56, 6.4);
        sketch.vertex(29.4, 9.8);
        sketch.vertex(18.2, 16.8);
        sketch.endShape(sketch.CLOSE);
    }

    function shapeRight() {
        sketch.beginShape();
        sketch.vertex(70.2, 24.6);
        sketch.bezierVertex(81, 22.2, 89.6, 27.8, 88.6, 40.2);
        sketch.bezierVertex(87, 55.8, 80, 60.4, 70, 71);
        sketch.vertex(59, 38.6);
        sketch.endShape(sketch.CLOSE);
    }

    function shapeBody() {
        sketch.beginShape();
        sketch.vertex(5.2, 65.2);
        sketch.bezierVertex(2, 37.8, 36.2, 30, 43.4, 30.6);
        sketch.bezierVertex(76.4, 29.2, 78.4, 53.4, 72.6, 67);
        sketch.bezierVertex(70.8, 73.4, 60.8, 84.2, 45.6, 84);
        sketch.bezierVertex(34.6, 84.6, 5.4, 75.4, 5.2, 65.2);
        sketch.endShape();
    }

    function shapeInside() {
        sketch.beginShape();
        sketch.vertex(17.6, 55.4);
        sketch.bezierVertex(17.2, 46.6, 30, 41.2, 39.8, 41.8);
        sketch.bezierVertex(55.8, 41.4, 63.8, 48.6, 63.6, 58);
        sketch.bezierVertex(61.4, 72, 61.2, 73.6, 45.6, 73.6);
        sketch.vertex(23.4, 68);
        sketch.endShape(sketch.CLOSE);
    }

    function shapeBone() {
        sketch.beginShape();
        sketch.vertex(25.8, 57.2);
        sketch.bezierVertex(42.6, 42, 54.4, 59, 41, 63);
        sketch.bezierVertex(42.2, 64.6, 49.2, 80.8, 35.2, 82);
        sketch.bezierVertex(22.8, 81.4, 21.8, 76, 24.8, 69.2);
        sketch.bezierVertex(19, 79.6, 9.4, 74, 10.6, 67.6);
        sketch.bezierVertex(11.8, 56.6, 17.4, 55.6, 25.8, 57.2);
        sketch.endShape();
    }

    function shapeBoneMiddle() {
        sketch.beginShape();
        sketch.vertex(22.2, 68)
        sketch.bezierVertex(23.8, 64.4, 25, 63.2, 28.2, 63.8);
        sketch.bezierVertex(26, 67.2, 28.6, 69, 27.4, 70.6);
        sketch.endShape();
    }

    function shapeBoneShadow() {
        sketch.beginShape();
        sketch.vertex(13.8, 64.8);
        sketch.bezierVertex(13.8, 66.8, 19.2, 67, 22.6, 66.2);
        sketch.vertex(28.6, 65.4);
        sketch.bezierVertex(31.4, 65, 29.4, 68.6, 29.4, 71.2);
        sketch.bezierVertex(37.8, 72.6, 40.8, 70, 39.8, 65.6);
        sketch.vertex(39, 61.2);
        sketch.vertex(43.6, 57);
        sketch.vertex(46.8, 56.8);
        sketch.vertex(42.2, 63.4);
        sketch.vertex(46.2, 71.2);
        sketch.vertex(40.2, 82.4);
        sketch.vertex(15, 76.4);
        sketch.vertex(11, 70.6);
        sketch.endShape();
    }


    sketch.fill(...swatch.shadow.fourColor);
    sketch.stroke(0);
    sketch.strokeWeight(7);
    shapeRight();

    sketch.fill(...swatch.shadow.fourColor);
    sketch.noStroke();
    shapeUp();

    sketch.noStroke();
    sketch.fill(...swatch.primary.fourColor);
    shapeUpLight();

    sketch.stroke(0);
    sketch.strokeWeight(7);
    sketch.noFill();
    shapeUp();

    sketch.fill(...swatch.shadow.fourColor);
    sketch.noStroke();
    shapeBody();

    sketch.noFill();
    sketch.stroke(0);
    sketch.strokeWeight(7);
    shapeBody();

    sketch.fill(...swatch.inside.fourColor);
    sketch.stroke(0);
    sketch.strokeWeight(4.5);
    shapeInside();

    sketch.fill(255);
    sketch.noStroke();
    shapeBone();

    sketch.fill(125);
    sketch.noStroke();
    shapeBoneShadow();

    sketch.fill(0);
    sketch.noStroke();
    shapeBoneMiddle();

    sketch.noFill();
    sketch.stroke(0);
    sketch.strokeWeight(6);
    shapeBone();

    sketch.pop();
}
