import { Color } from "./view.js";

export class AlienColorSwatch {
    constructor(
        public primary: Color,
        public shadow: Color,
        public inside: Color
    ) {}
}

export class AlienColor {
    static readonly RED     = new AlienColor(0,     new AlienColorSwatch(new Color(197, 17, 17), new Color(122, 8, 56), new Color(50, 4, 6)));
    static readonly BLUE    = new AlienColor(1,     new AlienColorSwatch(new Color(19, 46, 209), new Color(9, 21, 142), new Color(5, 13, 54)));
    static readonly GREEN   = new AlienColor(2,     new AlienColorSwatch(new Color(17, 127, 45), new Color(10, 77, 46), new Color(0, 34, 9)));
    static readonly PINK    = new AlienColor(3,     new AlienColorSwatch(new Color(237, 84, 186), new Color(171, 43, 173), new Color(71, 24, 53)));
    static readonly ORANGE  = new AlienColor(4,     new AlienColorSwatch(new Color(239, 125, 14), new Color(179, 63, 21), new Color(65, 33, 5)));
    static readonly YELLOW  = new AlienColor(5,     new AlienColorSwatch(new Color(246, 246, 88), new Color(195, 136, 35), new Color(64, 65, 24)));
    static readonly BLACK   = new AlienColor(6,     new AlienColorSwatch(new Color(63, 71, 78), new Color(30, 31, 38), new Color(17, 17, 17)));
    static readonly WHITE   = new AlienColor(7,     new AlienColorSwatch(new Color(214, 224, 240), new Color(131, 148, 191), new Color(57, 61, 60)));
    static readonly PURPLE  = new AlienColor(8,     new AlienColorSwatch(new Color(107, 49, 188), new Color(60, 23, 124), new Color(21, 18, 36)));
    static readonly BROWN   = new AlienColor(9,     new AlienColorSwatch(new Color(113, 73, 30), new Color(94, 38, 21), new Color(17, 15, 2)));
    static readonly CYAN    = new AlienColor(10,    new AlienColorSwatch(new Color(56, 254, 219), new Color(36, 168, 190), new Color(14, 67, 58)));
    static readonly LIME    = new AlienColor(11,    new AlienColorSwatch(new Color(80, 239, 57), new Color(21, 167, 66), new Color(10, 45, 13)));

    static get values() { return [
        this.RED,
        this.BLUE,
        this.GREEN,
        this.PINK,
        this.ORANGE,
        this.YELLOW,
        this.BLACK,
        this.WHITE,
        this.PURPLE,
        this.BROWN,
        this.CYAN,
        this.LIME,
    ]; };

    private constructor(
        public colorID: number,
        public swatch: AlienColorSwatch
    ) {}

    static fromID(colorID: number): AlienColor | undefined {
        for (const color of AlienColor.values) {
            if (colorID == color.colorID) return color;
        }
    }
}
