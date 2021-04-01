export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(p2: Point) { return new Point(this.x + p2.x, this.y + p2.y); }
    subtract(p2: Point) { return new Point(this.x - p2.x, this.y - p2.y); }
    multiply(scal: number) { return new Point(this.x * scal, this.y * scal); }
    divide(scal: number) { return new Point(this.x / scal, this.y / scal); }
    norm() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    normalize() { return this.divide(this.norm()); }
    equal(p2: Point) { return this.x == p2.x && this.y == p2.y; }
}
