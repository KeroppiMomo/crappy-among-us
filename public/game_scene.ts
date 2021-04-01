import { Scene } from "./scene_controller.js";
import { Point } from "./point.js";
import { Images } from "./resources.js";
import { GameMap, GameModal, MainMap, Interactable } from "./map/map.js";
import { LobbyMap } from "./map/lobby_map.js";
import { MapLocation, GameTask } from "./game_task.js";
import { DebugOptions } from "./debug_options.js";
import { MyWebSocket, MyWebSocketError } from "./websocket.js";
import { AlienColor } from "./alien_colors.js";
import { IntroModal } from "./map/intro_modal.js";
import { MiniMapModal } from "./map/mini_map_modal.js";
import { KilledModal } from "./map/killed_modal.js";
import { MeetingCalledModal } from "./map/meeting_called_modal.js";
import { MeetingModal } from "./map/meeting_modal.js";
import { EjectModal } from "./map/eject_modal.js";
import { BackgroundView, Color, TranslatedView, NonInteratableView, StackView, IfView, View, ShapeView, LineVertex, CanvasContextView, Size, EraseView, Rect, TintView, ImageView, TextView, EllipseView, RectangleView, RotatedView, RequireContextView } from "./view.js";
import { AlienView, DeadAlienView } from "./draw_sprite.js";

type p5 = any;

const SPEED = 400;
const ALIEN_WIDTH = 80;
const ALIEN_HEIGHT = 100;
const ALIEN_BASELINE = 90; // the position of the character is at the baseline and the width/2.
const DEAD_WIDTH = 70;
const DEAD_HEIGHT = 70;
const ACTION_BUTTON_WIDTH = 120;
const ACTION_BUTTON_HEIGHT = 120;
const ACTION_BUTTON_RIGHT = 100;
const ACTION_BUTTON_DOWN = 150;
const REPORT_BUTTON_WIDTH = 120;
const REPORT_BUTTON_HEIGHT = 120;
const REPORT_BUTTON_RIGHT = 100;
const REPORT_BUTTON_DOWN = 300;
const KILL_BUTTON_WIDTH = 120;
const KILL_BUTTON_HEIGHT = 120;
const KILL_BUTTON_RIGHT = 250;
const KILL_BUTTON_DOWN = 150;
const SERVER_TIMESTEP = 50;
const RAYCAST_NO_SAMPLES = 1000;
const RAYCAST_MAX_VIEW_DIST = 400;
// Align center horizontally about RIGHT, Align top vertically about DOWN

export type GameStage = "lobby" | "intro" | "game" | "meeting" | "ended";
export type GameOptions = {
    noImpostor: number,
    noEmergencyMeetings: number,
    discussionTime: number,
    votingTime: number,
    anonymousVoting: boolean,
    confirmEjects: boolean,
};

export class GameScene implements Scene {
    username: string;

    // Entity Interpolation
    players: {
        [key: string]: {
            color: AlienColor,
            latestTime: number,
            latestPos: Point,
            time: number, // Past time
            pos: Point, // Past position
            leftRight: boolean,
            isImpostor: boolean,
            isDead: boolean,
            deadPos?: Point,
        }
    };
    ownerUsername: string = "";
    options: GameOptions = {
        noImpostor: 2,
        noEmergencyMeetings: 3,
        discussionTime: 15,
        votingTime: 120,
        anonymousVoting: false,
        confirmEjects: true,
    };
    stage: GameStage = "lobby";
    noRemainEmergency: number = 0;

    pressedKeys: number[];

    map: GameMap;
    modal?: GameModal;

    tasks: GameTask[];

    constructor(username: string) {
        this.username = username;
        this.players = {};
        this.pressedKeys = [];
        this.tasks = [
            new GameTask(
                "upload_data",
                (task) => task.noCompleted == 0 ? "Download Data" : "Upload Data",
                0,
                [
                    [
                        MapLocation.Communications,
                        MapLocation.Weapons,
                        MapLocation.Navigation,
                        MapLocation.Cafeteria,
                    ][Math.floor(Math.random() * 4)],
                    MapLocation.Admin,
                ],
            ),
            new GameTask(
                "swipe_card",
                () => "Swipe Card",
                0,
                [ MapLocation.Admin ],
            ),
            new GameTask(
                "fix_wiring",
                () => "Fix Wiring",
                0,
                (() => {
                    // Reference: https://among-us.fandom.com/wiki/Fix_Wiring#The_Skeld
                    const locIndex = new Array<number>();
                    for (let i = 0; i < 3; ++i) {
                        let locI: number;
                        do {
                            locI = Math.floor(Math.random() * 6);
                        } while (locIndex.includes(locI));
                        locIndex.push(locI);
                    }
                    locIndex.sort();

                    return locIndex.map((i) => [
                        MapLocation.Electrical,
                        MapLocation.Storage,
                        MapLocation.Admin,
                        MapLocation.Navigation,
                        MapLocation.Cafeteria,
                        MapLocation.Security,
                    ][i]);
                })(),
            ),
            new GameTask(
                "refuel_engines",
                () => "Refuel Engines",
                0,
                [
                    MapLocation.Storage,
                    MapLocation.LowerEngine,
                    MapLocation.Storage,
                    MapLocation.UpperEngine,
                ],
            ),
            new GameTask(
                "align_engine",
                () => "Align Engine Output",
                0,
                (Math.random() < 1/2) ? [ MapLocation.UpperEngine, MapLocation.LowerEngine ] : [ MapLocation.LowerEngine, MapLocation.UpperEngine ],
            ),
        ];
        this.map = new LobbyMap();
        // this.modal = new EjectModal("Pascal", AlienColor.RED, true, 3);
        // this.map = new MainMap();
    }

    // USER INTERACTION --------------------------------------------------------------

    isTaskLocationCurrent(taskID: string, location: MapLocation): boolean {
        const task = this.tasks.filter((task) => task.id === taskID);
        if (task.length != 1) return false;
        if (task[0].noCompleted == task[0].stages.length) return false;
        return task[0].stages[task[0].noCompleted] == location;
    }

    onKeyDown(keyCode: number) {
        this.pressedKeys.push(keyCode);
        if (this.modal?.blockKey) {
            this.modal?.onKeyDown?.(keyCode);
        } else {
            if (keyCode == 32) { // Space
                if (!this.modal) this.onActionButtonPressed();
            } else if (keyCode == 77) { // m
                if (!this.modal) this.onMiniMapButtonPressed();
            } else if (keyCode == 82) { // r
                if (!this.modal) this.onReportPressed();
            }
        }
    }
    onKeyUp(keyCode: number) {
        this.pressedKeys = this.pressedKeys.filter((v) => v !== keyCode);
        if (this.modal?.blockKey) {
            this.modal?.onKeyUp?.(keyCode);
        } else {
            if (keyCode == 77) { // m
                if (this.modal && this.modal instanceof MiniMapModal) this.modal.removeModal?.();
            }
        }
    }

    onMousePressed(sketch: p5) {
        if (this.modal) {
            this.modal.onMousePressed?.(sketch);
        } else if (this.isMouseOnActionButton(sketch)) {
            this.onActionButtonPressed();
        } else if (this.isMouseOnMiniMapButton(sketch)) {
            this.onMiniMapButtonPressed();
        } else if (this.isMouseOnKillButton(sketch)) {
            this.onKillPressed();
        } else if (this.isMouseOnReportButton(sketch)) {
            this.onReportPressed();
        } else if (sketch.mouseX >= sketch.windowWidth/2 - 187/2 && sketch.mouseX <= sketch.windowWidth/2 + 187/2
                   && sketch.mouseY >= sketch.windowHeight*3/4 - 106/2 && sketch.mouseY <= sketch.windowHeight*3/4 + 106/2) {
            if (Object.keys(this.players).length >= this.minNoPlayers(1)) {
                MyWebSocket.instance.send(
                    "startGame",
                    {},
                );
            }
        }
    }

    onMouseDragged(sketch: p5) {
        if (this.modal) {
            this.modal.onMouseDragged?.(sketch);
        }
    }

    onMouseReleased(sketch: p5) {
        if (this.modal) {
            this.modal.onMouseReleased?.(sketch);
        }
    }

    isMouseOnActionButton(sketch: p5) {
        return sketch.mouseX > sketch.windowWidth - ACTION_BUTTON_RIGHT - ACTION_BUTTON_WIDTH/2 && sketch.mouseX < sketch.windowWidth - ACTION_BUTTON_RIGHT + ACTION_BUTTON_WIDTH/2
            && sketch.mouseY > sketch.windowHeight - ACTION_BUTTON_DOWN && sketch.mouseY < sketch.windowHeight - ACTION_BUTTON_DOWN + ACTION_BUTTON_HEIGHT;
    }

    isMouseOnMiniMapButton(sketch: p5) {
        return new Point(sketch.mouseX, sketch.mouseY).subtract(new Point(sketch.windowWidth - 50, 150)).norm() < 30;
    }

    isMouseOnKillButton(sketch: p5) {
        return this.players[this.username].isImpostor
            && sketch.mouseX > sketch.windowWidth - KILL_BUTTON_RIGHT - KILL_BUTTON_WIDTH/2 && sketch.mouseX < sketch.windowWidth - KILL_BUTTON_RIGHT + KILL_BUTTON_WIDTH/2
            && sketch.mouseY > sketch.windowHeight - KILL_BUTTON_DOWN && sketch.mouseY < sketch.windowHeight - KILL_BUTTON_DOWN + KILL_BUTTON_HEIGHT;
    }

    isMouseOnReportButton(sketch: p5) {
        return sketch.mouseX > sketch.windowWidth - REPORT_BUTTON_RIGHT - REPORT_BUTTON_WIDTH/2 && sketch.mouseX < sketch.windowWidth - REPORT_BUTTON_RIGHT + REPORT_BUTTON_WIDTH/2
            && sketch.mouseY > sketch.windowHeight - REPORT_BUTTON_DOWN && sketch.mouseY < sketch.windowHeight - REPORT_BUTTON_DOWN + REPORT_BUTTON_HEIGHT;
    }

    onActionButtonPressed() {
        const modal = this.getCurrentInteractable()?.onInteract(this);
        if (modal) {
            this.modal = modal;
            this.modal.removeModal = () => {
                this.modal = undefined;
            };
        }
    }

    onMiniMapButtonPressed() {
        if (this.modal) return;
        this.modal = new MiniMapModal(this);
        this.modal.removeModal = () => this.modal = undefined;
    }

    onKillPressed() {
        const target = this.getKillTarget();
        if (!target) return;
        MyWebSocket.instance.send("kill", {
            target: target,
        }).then((data) => {
            if (typeof data.tpPos != "object" || typeof (data.tpPos as any).x != "number" || typeof (data.tpPos as any).y != "number") {
                console.error("Unable to parse server tpPos", data);
                return;
            }
            this.players[this.username].pos = new Point((data.tpPos as any).x, (data.tpPos as any).y);
        }).catch((error) => {
            console.error("Server declined request to kill.", error);
        });
    }

    onReportPressed() {
        if (!this.canReport()) return;
        MyWebSocket.instance.send("reportBody", {});
    }

    isHitWall(oriPos: Point, velVec: Point): boolean {
        // Yay copied from https://stackoverflow.com/a/24392281/10845353 thank you very much
        // returns true iff the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
        function intersects(a: number, b: number, c: number, d: number, p: number, q: number, r: number, s: number): boolean {
            var det, gamma, lambda;
            det = (c - a) * (s - q) - (r - p) * (d - b);
            if (det === 0) {
                return false;
            } else {
                lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
                gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
                return (0 <= lambda && lambda <= 1) && (0 <= gamma && gamma <= 1);
            }
        }
        for (const wall of this.map.walkWalls) {
            if (intersects(wall.start.x, wall.start.y, wall.end.x, wall.end.y, oriPos.x - ALIEN_WIDTH/2, oriPos.y, oriPos.add(velVec).x - ALIEN_WIDTH/2, oriPos.add(velVec).y)
               || intersects(wall.start.x, wall.start.y, wall.end.x, wall.end.y, oriPos.x + ALIEN_WIDTH/2, oriPos.y, oriPos.add(velVec).x + ALIEN_WIDTH/2, oriPos.add(velVec).y)) {
                return true;
            }
        }
        return false;
    }


    /// Returns whether there is movement
    handlePositionKey(frameRate: number) {
        if (this.modal?.blockKey) return;

        const isDead = this.players[this.username].isDead;
        let result = false;
        DebugOptions.displayFPS = true;
        const speedFrame = SPEED / frameRate;
        if (this.pressedKeys.includes(87)) { // W
            if (isDead || !this.isHitWall(this.players[this.username].pos, new Point(0, -speedFrame))) {
                this.players[this.username].pos = this.players[this.username].pos.add(new Point(0, -speedFrame));
                result = true;
            }
        }
        if (this.pressedKeys.includes(83)) { // S
            if (isDead || !this.isHitWall(this.players[this.username].pos, new Point(0, speedFrame))) {
                this.players[this.username].pos = this.players[this.username].pos.add(new Point(0, speedFrame));
                result = true;
            }
        }
        if (this.pressedKeys.includes(65)) { // A
            if (isDead || !this.isHitWall(this.players[this.username].pos, new Point(-speedFrame, 0))) {
                this.players[this.username].pos = this.players[this.username].pos.add(new Point(-speedFrame, 0));
                this.players[this.username].leftRight = false;
                result = true;
            }
        }
        if (this.pressedKeys.includes(68)) { // D
            if (isDead || !this.isHitWall(this.players[this.username].pos, new Point(speedFrame, 0))) {
                this.players[this.username].pos = this.players[this.username].pos.add(new Point(speedFrame, 0));
                this.players[this.username].leftRight = true;
                result = true;
            }
        }

        return result;
    }

    getCurrentInteractable() {
        for (const interactable of this.map.interactables) {
            if (interactable.isInteractable(this)) {
                return interactable;
            }
        }
        return null;
    }

    // LOGIC -----------------------------------------------------------------------------------------------

    minNoPlayers(noImpostor: number): number {
        if (noImpostor == 1) return 4;
        else if (noImpostor == 2) return 7;
        else if (noImpostor == 3) return 9;
        else throw Error("noImpostor should only be 1, 2 or 3");
    }

    maxNoImpostor(noPlayers: number): number {
        if (noPlayers < 4) return 0;
        else if (noPlayers < 7) return 1;
        else if (noPlayers < 9) return 2;
        else return 3;
    }

    /// If a user can be killed, return the distance between the two.
    /// Otherwise, return NaN.
    canKill(username: string): number {
        const KILL_DISTANCE = 200;

        if (!this.players[this.username].isImpostor) return NaN;
        if (this.players[username].isImpostor) return NaN;
        if (this.players[username].isDead) return NaN;

        // Use latestPos because it should not consider entity interpolation
        if (this.players[this.username].pos.subtract(this.players[username].latestPos).norm() > KILL_DISTANCE) return NaN;

        // Ofc I'm gonna copied from somewhere again https://github.com/pgkelley4/line-segments-intersect/blob/master/js/line-segments-intersect.js
        function doSegmentIntersect(p1: Point, p2: Point, q1: Point, q2: Point) {
            function allEqual(...args: any[]) { // I edited this part
                if (args.length == 0) return true;
                for (const arg of args) {
                    if (arg !== args[0]) return false;
                }
                return true;
            }
            var r = p2.subtract(p1);
            var s = q2.subtract(q1);

            var uNumerator = q1.subtract(p1).cross(r);
            var denominator = r.cross(s);

            if (uNumerator == 0 && denominator == 0) {
                if (p1.equal(q1) || p1.equal(q2) || p2.equal(q1) || p2.equal(q2)) return true
                    return !allEqual(
                        (q1.x - p1.x < 0),
                        (q1.x - p2.x < 0),
                        (q2.x - p1.x < 0),
                        (q2.x - p2.x < 0)) ||
                            !allEqual(
                                (q1.y - p1.y < 0),
                                (q1.y - p2.y < 0),
                                (q2.y - p1.y < 0),
                                (q2.y - p2.y < 0));
            }

            if (denominator == 0) {
                return false;
            }

            var u = uNumerator / denominator;
            var t = q1.subtract(p1).cross(s) / denominator;

            return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
        }

        // Philosophy: you can't kill somebody if you can't walk to him
        for (const wall of this.map.walkWalls) {
            if (doSegmentIntersect(this.players[this.username].pos, this.players[username].latestPos, wall.start, wall.end)) {
                return NaN;
            }
        }

        return this.players[this.username].pos.subtract(this.players[username].latestPos).norm();
    }

    getKillTarget(): string | undefined {
         let res: string | undefined = undefined;
         let resDist: number = NaN;
         for (const username in this.players) {
              const r = this.canKill(username);
              if (isNaN(r)) continue;
              else if (!res || r < resDist) {
                  res = username;
                  resDist = r;
              }
         }

         return res;
    }

    canReport(): boolean {
        const REPORT_DISTANCE = 300;
        if (this.players[this.username].isDead) return false;
        for (const username in this.players) {
            if (!this.players[username].deadPos) continue;
            if (this.players[username].deadPos!.subtract(this.players[this.username].pos).norm() < REPORT_DISTANCE) return true;
        }

        return false;
    }

    // RENDERING -----------------------------------------------------------------------------------------
    render(sketch: p5) {
        if (this.handlePositionKey(sketch.frameRate())) {
            this.updateServerPosition();
        }

        this.interpolatePos();

        if (DebugOptions.logMousePosition) {
            this.logMousePosition(sketch);
        }

        const curInteractable = this.getCurrentInteractable();
        const killTarget = this.getKillTarget();

        const windowSize = new Point(sketch.windowWidth, sketch.windowHeight);

        new BackgroundView({
            color: new Color(0),
            child: new StackView({ children: [
                new TranslatedView({
                    offset: windowSize.divide(2).subtract(this.players[this.username].pos),
                    child: new StackView({
                        children: [
                            new NonInteratableView({
                                render: (sketch: p5) => this.map.preRender?.(sketch),
                            }),
                            this.buildInteractables(curInteractable),
                            new IfView({
                                condition: this.players[this.username].isDead,
                                thenChild: () => this.buildPlayers(killTarget),
                            }),
                        ],
                    }),
                }),
                new IfView({
                    condition: !this.players[this.username].isDead,
                    thenChild: () => {
                        const raycasting = this.raycast();
                        return new StackView({
                            children: [
                                this.buildRayCasting(Color.black.withOpacity(0.47), sketch.windowWidth, sketch.windowHeight, raycasting),
                                new CanvasContextView({
                                    rect: Rect.fromSize(windowSize.divide(2).subtract(new Point(RAYCAST_MAX_VIEW_DIST, RAYCAST_MAX_VIEW_DIST)), new Size(RAYCAST_MAX_VIEW_DIST*2, RAYCAST_MAX_VIEW_DIST*2)),
                                    id: "player",
                                    size: new Size(RAYCAST_MAX_VIEW_DIST*2, RAYCAST_MAX_VIEW_DIST*2),
                                    child: new StackView({ children: [
                                        new TranslatedView({
                                            offset: new Point(RAYCAST_MAX_VIEW_DIST, RAYCAST_MAX_VIEW_DIST).subtract(this.players[this.username].pos),
                                            child: this.buildPlayers(killTarget),
                                        }),
                                        new EraseView({
                                            child: this.buildRayCasting(Color.black, RAYCAST_MAX_VIEW_DIST*2, RAYCAST_MAX_VIEW_DIST*2, raycasting),
                                        }),
                                    ]}),
                                }),
                            ],
                        });
                    },
                }),
                this.buildActionButton(curInteractable, windowSize),
                new IfView({
                    condition: this.players[this.username].isImpostor,
                    thenChild: () => this.buildKillButton(windowSize),
                }),
                new IfView({
                    condition: this.stage == "game",
                    thenChild: () => this.buildReportButton(windowSize),
                }),
                new IfView({
                    condition: this.map instanceof LobbyMap,
                    thenChild: () => new StackView({ children: [
                        new IfView({
                            condition: this.ownerUsername == this.username,
                            thenChild: () => this.buildStartButton(windowSize),
                        }),
                        this.buildGameInfo(),
                    ]}),
                    elseChild: () => new StackView({ children: [
                        this.buildMiniMapButton(windowSize),
                        this.buildTasks(),
                    ]}),
                }),
                new NonInteratableView({ render: (sketch: p5) => {
                    this.modal?.render(sketch);
                }}),
                new IfView({
                    condition: DebugOptions.displayFPS,
                    thenChild: () => this.buildFPS(windowSize),
                }),
            ]}),
        }).render(sketch);
    }

    logMousePosition(sketch: p5) {
        const mouseX = sketch.mouseX - sketch.windowWidth/2 + this.players[this.username].pos.x;
        const mouseY = sketch.mouseY - sketch.windowHeight/2 + this.players[this.username].pos.y;
        const mouse = new Point(mouseX, mouseY);
        let closest = new Point(-100000000, 10000000);
        for (const wall of this.map.lightWalls) {
            if (wall.start.subtract(mouse).norm() < closest.subtract(mouse).norm()) {
                closest = wall.start;
            }
            if (wall.end.subtract(mouse).norm() < closest.subtract(mouse).norm()) {
                closest = wall.end;
            }
        }
        console.log(`${mouseX}, ${mouseY} (${closest.x}, ${closest.y})`);
    }

    raycast(): Point[] {
        /// Copied from https://editor.p5js.org/SebastienR/sketches/2rGNT5FNS Ray.js yay thx
        function cast(rayStart: Point, rayEnd: Point, segmentStart: Point, segmentEnd: Point) {
            // Checks if the ray intersects with a wall
            // If it does, check where and return the point
            const x1 = segmentStart.x;
            const y1 = segmentStart.y;
            const x2 = segmentEnd.x;
            const y2 = segmentEnd.y;

            const x3 = rayStart.x;
            const y3 = rayStart.y;
            const x4 = rayEnd.x;
            const y4 = rayEnd.y;

            const den1 = (x1 - x2) * (y3 - y4);
            const den2 = (y1 - y2) * (x3 - x4);
            const den = den1 - den2
            if (den === 0) return null;

            const t1 = (x1 - x3) * (y3 - y4);
            const t2 = (y1 - y3) * (x3 - x4);
            const t = (t1 - t2) / den;

            const u1 = (x1 - x2) * (y1 - y3);
            const u2 = (y1 - y2) * (x1 - x3);
            const u = - (u1 - u2) / den;

            if (t > 0 && t < 1 && u > 0) {
                return new Point(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
            } else {
                return null;
            }
        }

        // I'm just plain lazy so i just copy from here https://stackoverflow.com/a/1501725/10845353
        function distToSegmentSquared(p: Point, v: Point, w: Point) {
            function sqr(x: number) { return x * x }
            function dist2(v: Point, w: Point) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
            var l2 = dist2(v, w);
            if (l2 == 0) return dist2(p, v);
            var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
            t = Math.max(0, Math.min(1, t));
            return dist2(p, new Point(v.x + t * (w.x - v.x), v.y + t * (w.y - v.y)));
        }


        const PI = Math.PI;
        const origin = this.players[this.username].pos;
        /// Filter all walls further away to make it faster
        const reducedWalls = this.map.lightWalls.filter((wall) => distToSegmentSquared(origin, wall.start, wall.end) <= RAYCAST_MAX_VIEW_DIST*RAYCAST_MAX_VIEW_DIST);
        const vertices: Point[] = [];
        for (let angle = 0; angle < 2*PI; angle += 2*PI/RAYCAST_NO_SAMPLES) {
            let minDist = RAYCAST_MAX_VIEW_DIST;
            for (const wall of reducedWalls) {
                const castPoint = cast(origin, origin.add(new Point(Math.cos(angle), Math.sin(angle))), wall.start, wall.end);
                if (!castPoint) continue;
                const dist = castPoint.subtract(origin).norm();
                minDist = Math.min(minDist, dist);
            }

            vertices.push(new Point(Math.cos(angle), Math.sin(angle)).multiply(minDist).add(origin));
        }

        return vertices;
    }

    // Idk why p5.Graphics returns the wrong windowWidth and windowHeight after the window is resized
    // Edit (about one month later): probably because windowWidth and windowHeight return the WINDOW size but not the canvas size
    buildRayCasting(fill: Color, windowWidth: number, windowHeight: number, raycasting: Point[]): View {
        return new ShapeView({
            stroke: Color.transparent,
            strokeWeight: 0,
            fill: fill,
            vertices: [
                new LineVertex(0, windowHeight),
                new LineVertex(windowWidth, windowHeight),
                new LineVertex(windowWidth, 0),
                new LineVertex(0, 0),
            ],
            contour: raycasting.map((v) => new LineVertex(
                v.x + (windowWidth/2 - this.players[this.username].pos.x),
                v.y + (windowHeight/2 - this.players[this.username].pos.y),
            )),
        });
    }

    buildInteractables(curInteractable: Interactable | null): View {
        return new StackView({
            children: this.map.interactables.map((interactable) => new NonInteratableView({
                render: (sketch: p5) => interactable.render(sketch, this, interactable == curInteractable),
            })),
        });
    }

    buildPlayers(killTarget: string | undefined): View {
        // For sorting the players according to y value
        let objects: {
            pos: Point,
            view: View,
        }[] = [];

        for (const username of Object.keys(this.players)) {
            const player = this.players[username];
            if (player.isDead) {
                if (player.deadPos !== undefined) {
                    objects.push({
                        pos: player.deadPos,
                        view: new DeadAlienView({
                            rect: Rect.fromSize(player.deadPos!.subtract(new Point(DEAD_WIDTH/2, DEAD_HEIGHT)), new Size(DEAD_WIDTH, DEAD_HEIGHT)),
                            swatch: player.color.swatch,
                            opacity: 1,
                        }),
                    });
                }
            }

            if (!player.isDead || (player.isDead && this.players[this.username].isDead)) {
                objects.push({
                    pos: player.pos,
                    view: new StackView({ children: [
                        new AlienView({
                            rect: Rect.fromSize(player.pos.subtract(new Point(ALIEN_WIDTH/2, ALIEN_BASELINE)), new Size(ALIEN_WIDTH, ALIEN_HEIGHT)),
                            swatch: player.color.swatch,
                            leftRight: player.leftRight,
                            opacity: player.isDead ? 0.3 : 1,
                        }),
                        new IfView({
                            condition: username === killTarget,
                            thenChild: () => new RectangleView({
                                rect: Rect.fromSize(player.pos.subtract(new Point(ALIEN_WIDTH/2, ALIEN_BASELINE)), new Size(ALIEN_WIDTH, ALIEN_HEIGHT)),
                                fill: Color.transparent,
                                stroke: new Color(255, 0, 0),
                                strokeWeight: 3,
                            }),
                        }),
                        new TextView({
                            text: username,
                            pos: player.pos.subtract(new Point(0, ALIEN_BASELINE + 5.0)),
                            fontSize: 20,
                            horizontalAlign: "center",
                            verticalAlign: "baseline",
                            fill: Color.white,
                            stroke: Color.black,
                            strokeWeight: 3,
                        }),
                    ]}),
                });
            }
        }

        return new StackView({ children: objects.sort((a, b) => a.pos.y - b.pos.y).map((v) => v.view) });
    }

    buildActionButton(curInteractable: Interactable | null, windowSize: Point): View {
        const imageRect = Rect.fromSize(windowSize.subtract(
            new Point(ACTION_BUTTON_RIGHT + ACTION_BUTTON_WIDTH/2, ACTION_BUTTON_DOWN)),
            new Size(ACTION_BUTTON_WIDTH, ACTION_BUTTON_HEIGHT)
        );

        return new IfView({
            condition: curInteractable === null,
            thenChild: () => new TintView({
                color: new Color(255, 100),
                child: new ImageView({
                    image: Images["use"],
                    rect: imageRect,
                }),
            }),
            elseChild: () => new ImageView({
                image: Images[curInteractable!.buttonImageName],
                rect: imageRect,
            }),
        });
    }

    buildKillButton(windowSize: Point): View {
        let canKill = false;
        for (const username in this.players) {
            if (username == this.username) continue;
            if (this.canKill(username)) {
                canKill = true;
                break;
            }
        }

        const imageRect = Rect.fromSize(windowSize.subtract(
            new Point(KILL_BUTTON_RIGHT + KILL_BUTTON_WIDTH/2, KILL_BUTTON_DOWN)),
            new Size(KILL_BUTTON_WIDTH, KILL_BUTTON_HEIGHT)
        );

        return new IfView({
            condition: canKill,
            thenChild: () => new ImageView({
                image: Images["kill"],
                rect: imageRect,
            }),
            elseChild: () => new TintView({
                color: new Color(255, 100),
                child: new ImageView({
                    image: Images["kill"],
                    rect: imageRect,
                }),
            }),
        });
    }

    buildReportButton(windowSize: Point): View {
        const imageRect = Rect.fromSize(windowSize.subtract(
            new Point(REPORT_BUTTON_RIGHT + REPORT_BUTTON_WIDTH/2, REPORT_BUTTON_DOWN)),
            new Size(REPORT_BUTTON_WIDTH, REPORT_BUTTON_HEIGHT)
        );

        return new IfView({
            condition: this.canReport(),
            thenChild: () => new ImageView({
                image: Images["report"],
                rect: imageRect,
            }),
            elseChild: () => new TintView({
                color: new Color(255, 100),
                child: new ImageView({
                    image: Images["report"],
                    rect: imageRect,
                }),
            }),
        });
    }

    buildMiniMapButton(windowSize: Point): View {
        return new StackView({ children: [
            new EllipseView({
                rect: new Rect(windowSize.x - 50 - 60/2, 150-60/2, 60, 60),
                stroke: new Color(160),
                strokeWeight: 5,
                fill: Color.white,
            }),
            new ImageView({
                image: Images["minimap"],
                rect: new Rect(windowSize.x - 75, 125, 50, 50),
            }),
        ]});
    }

    buildStartButton(windowSize: Point): View {
        const imageRect = new Rect(windowSize.x/2-187/2, windowSize.y*3/4 - 106/2, 187, 106);
        return new IfView({
            condition: Object.keys(this.players).length >= this.minNoPlayers(1),
            thenChild: () => new ImageView({
                image: Images["start"],
                rect: imageRect,
            }),
            elseChild: () => new TintView({
                color: new Color(255, 100),
                child: new ImageView({
                    image: Images["start"],
                    rect: imageRect,
                })
            }),
        });
    }

    buildGameInfo(): View {
        // Sweet syntatic sugar
        const textConfig: Omit<ConstructorParameters<typeof TextView>[0], "text" | "pos"> = {
            fontSize: 20,
            horizontalAlign: "left",
            verticalAlign: "baseline",
            fill: Color.white,
            stroke: Color.black,
            strokeWeight: 3,
        };

        const info: [string, string][] = [
            [ "Owner", this.ownerUsername ],
            [ "Players", `${Object.keys(this.players).length}/10` ],
            [ "Impostors", (() => {
                let message = this.options.noImpostor.toString();
                if (this.options.noImpostor <= this.maxNoImpostor(Object.keys(this.players).length)) return message;
                else return message + ` (Limit: ${this.maxNoImpostor(Object.keys(this.players).length)})`;
            })()],
            [ "Emergency Meetings", this.options.noEmergencyMeetings.toString() ],
            [ "Discussion Time", `${this.options.discussionTime}s` ],
            [ "Voting Time", this.options.votingTime == 0 ? "∞" : `${this.options.votingTime}s` ],
            [ "Anonymous Voting", this.options.anonymousVoting ? "Yes" : "No" ],
            [ "Confirm Ejects", this.options.confirmEjects ? "Yes" : "No" ],
        ];

        return new StackView({ children: [
            new TextView({
                text: "Game Info",
                pos: new Point(20, 30),
                ...textConfig,
            }),
            ...Array.for(
                () => ({ i: 0, y: 60 }),
                ({i}) => i < info.length,
                ({i, y}) => ({ i: i+1, y: y+25 }),
            ).flatMap(({i, y}) => [
                new TextView({
                    text: info[i][0],
                    pos: new Point(20, y),
                    ...textConfig,
                }),
                new TextView({
                    text: info[i][1],
                    pos: new Point(250, y),
                    ...textConfig,
                }),
            ]),
        ]});
    }

    buildTasks(): View {
        return new StackView({ children: [
            new RectangleView({
                rect: new Rect(0, 25, 400, 300),
                stroke: Color.transparent,
                strokeWeight: 0,
                fill: new Color(100, 150),
            }),
            new RectangleView({
                rect: new Rect(400, 25, 50, 100),
                stroke: Color.transparent,
                strokeWeight: 0,
                fill: new Color(100, 150),
            }),
            new RotatedView({
                angle: -Math.PI/2,
                child: new TextView({
                    text: "Tasks",
                    pos: new Point(-75, 425),
                    fontSize: 20,
                    horizontalAlign: "center",
                    verticalAlign: "center",
                    fill: Color.white,
                    stroke: Color.black,
                    strokeWeight: 3,
                }),
            }),
            ...this.tasks.map((task, i) => new TextView({
                text: `${task.stages[Math.min(task.stages.length-1, task.noCompleted)]}: ${task.getName(task)}`
                    + ((task.stages.length == 1) ? "" :  ` (${task.noCompleted}/${task.stages.length})`),
                pos: new Point(25, 50 + 25 * i),
                fontSize: 20,
                horizontalAlign: "left",
                verticalAlign: "baseline",
                fill: (task.noCompleted  == task.stages.length)
                    ? new Color(92, 204, 62)
                    : ((task.noCompleted == 0)
                        ? Color.white
                        : new Color(299, 227, 84)
                      ),
                stroke: Color.black,
                strokeWeight: 3,
            })),
        ]});
    }

    buildFPS(windowSize: Point): View {
        return new RequireContextView({ builder: (sketch: p5) => new TextView({
            text: `Frame rate: ${sketch.frameRate().toFixed(1)} fps`,
            pos: new Point(windowSize.x, 0),
            fontSize: 20,
            horizontalAlign: "right",
            verticalAlign: "top",
            fill: Color.white,
            stroke: Color.black,
            strokeWeight: 3,
        })});
    }

    // SERVER INTERACTION -------------------------------------------------------------------------------------

    onShow() {
        this.listenServer();
        this.players[this.username] = {
            color: AlienColor.RED,
            latestTime: Date.now(),
            latestPos: new Point(0, 0),
            time: Date.now(),
            pos: new Point(0, 0),
            leftRight: true,
            isDead: false,
            isImpostor: false,
        };
    }

    onHide() {
        MyWebSocket.instance.removeListener("gameUpdate", this.serverUpdate.bind(this));
    }

    /// Entity Interpolation
    interpolatePos() {
        for (const username in this.players) {
            if (username == this.username) continue;
            const info = this.players[username];
            const curTime = Date.now();
            const newPastTime = curTime - SERVER_TIMESTEP;
            if (info.latestTime >= newPastTime) {
                this.players[username].pos = info.latestPos.subtract(info.pos).multiply((newPastTime - info.time) / (info.latestTime - info.time)).add(info.pos);
            } else {
                this.players[username].pos = info.latestPos;
            }
            this.players[username].time = newPastTime;
        }
    }

    listenServer() {
        MyWebSocket.instance.addListener("gameUpdate", this.serverUpdate.bind(this));
        MyWebSocket.instance.addListener("intro", this.handleIntro.bind(this));
        MyWebSocket.instance.addListener("killed", this.handleKilled.bind(this));
        MyWebSocket.instance.addListener("meetingCalled", this.meetingCalled.bind(this));
    }

    updateServerPosition() {
        if (this.stage == "lobby" || this.stage == "game") {
            MyWebSocket.instance.send("playerMove", {
                x: this.players[this.username].pos.x,
                y: this.players[this.username].pos.y,
                leftRight: this.players[this.username].leftRight,
            });
        }
    }

    serverUpdate(data: { [key: string]: any }) {
        if (typeof data.players !== "object" || typeof data.owner !== "string" || typeof data.options !== "object") {
            console.error("Unable to parse incoming message", data);
            return;
        }

        let isForceUpdate = false;

        if (this.stage == "intro") {
            this.stage = "game";
            this.map = new MainMap();
            isForceUpdate = true;
        }

        if (this.stage == "meeting") {
            isForceUpdate = true;
        }

        for (const username in data.players) {
            if (typeof data.players[username].pos !== "object") throw new MyWebSocketError("Unable to parse incoming message.", data);
            const posX = data.players[username].pos.x;
            const posY = data.players[username].pos.y;
            if (typeof posX !== "number" || typeof posY !== "number") throw new MyWebSocketError("Unable to parse incoming message.", data);
            const leftRight = data.players[username].leftRight;
            if (typeof leftRight !== "boolean") throw new MyWebSocketError("Unable to parse incoming message.", data);
            const colorID = data.players[username].colorID;
            if (typeof colorID !== "number" || !Number.isInteger(colorID) || colorID < 0 || colorID >= 12) throw new MyWebSocketError("Unable to parse incoming message.", data);
            const isDead = data.players[username].isDead;
            if (typeof isDead !== "boolean") throw new MyWebSocketError("Unable to parse incoming message.", data);
            let deadPos: Point | undefined;
            if (data.players[username].deadPos !== undefined) {
                const x = data.players[username].deadPos.x;
                const y = data.players[username].deadPos.y;
                if (typeof posX !== "number" || typeof posY !== "number") throw new MyWebSocketError("Unable to parse incoming message.", data);
                deadPos = new Point(x, y);
            }

            if (!isForceUpdate && username == this.username) {
                this.players[username].color = AlienColor.fromID(colorID)!;
                this.players[username].isDead = isDead;
                this.players[username].deadPos = deadPos;
                continue;
            }
            if (this.players[username] != undefined) {
                this.players[username].latestPos = new Point(posX, posY);
                this.players[username].latestTime = Date.now();
                this.players[username].leftRight = leftRight;
                this.players[username].color = AlienColor.fromID(colorID)!;
                this.players[username].isDead = isDead;
                this.players[username].deadPos = deadPos;
                if (isForceUpdate) {
                    this.players[username].pos = new Point(posX, posY);
                    this.players[username].time = Date.now() - SERVER_TIMESTEP;
                }
            } else {
                this.players[username] = {
                    color: AlienColor.fromID(colorID)!,
                    latestPos: new Point(posX, posY),
                    latestTime: Date.now(),
                    pos: new Point(posX, posY),
                    time: Date.now() - SERVER_TIMESTEP,
                    leftRight: leftRight,
                    isDead: isDead,
                    deadPos: deadPos,
                    isImpostor: false,
                };
            }
        }

        for (const username in this.players) {
            if (data.players[username] === undefined) {
                delete this.players[username];
            }
        }

        this.ownerUsername = data.owner;

        for (const key in data.options) {
            if ((this.options as any)[key] == undefined) throw new MyWebSocketError("Unknown option key.", data);
            if (typeof (this.options as any)[key] != typeof data.options[key]) throw new MyWebSocketError("Unknown option key.", data);
            (this.options as any)[key] = data.options[key];
        }

        const noRemainEmergency = data.noRemainEmergency;
        if (typeof noRemainEmergency != "number") throw new MyWebSocketError("Unable to parse incoming message.", data);
        this.noRemainEmergency = noRemainEmergency;
    }

    handleIntro(data: { [key: string]: any }) {
        if (typeof data.noImpostor != "number" || typeof data.isImpostor != "boolean" || typeof data.players != "object") {
            console.error("Unable to parse incoming message", data);
            return;
        }
        if (this.modal instanceof IntroModal) return;
        this.modal = new IntroModal(this, data.noImpostor);
        this.modal.removeModal = () => this.modal = undefined;

        this.stage = "intro";

        setTimeout(() => {
            const isImpostor = data.isImpostor;

            this.players = {};
            for (const username in data.players) {
                if (typeof data.players[username].colorID != "number" || (isImpostor && typeof data.players[username].isImpostor != "boolean")) {
                    console.error("Unable to parse incoming message", data);
                    return;
                }
                this.players[username] = {
                    color: AlienColor.fromID(data.players[username].colorID)!,
                    latestPos: new Point(0, 0),
                    latestTime: Date.now(),
                    pos: new Point(0, 0),
                    time: Date.now() - SERVER_TIMESTEP,
                    leftRight: true,
                    isDead: false,
                    isImpostor: isImpostor && data.players[username].isImpostor,
                };
            }
        }, 1000);
    }

    handleKilled(data: { [key: string]: any }) {
        if (typeof data.killer != "string") console.error("Unable to parse incoming message", data);
        const killerUsername: string = data.killer;
        this.modal = new KilledModal({
            userColor: this.players[this.username].color,
            killerColor: this.players[killerUsername].color,
            killerUsername: killerUsername,
        });
        this.modal!.removeModal = () => this.modal = undefined;
    }

    meetingCalled(data: { [key: string]: any }) {
        if (typeof data.body != "string" && typeof data.body != "undefined") console.error("Unable to parse incoming message", data);
        const body: string | undefined = data.body;
        this.modal = new MeetingCalledModal(this, body);
        this.modal!.removeModal = () => this.modal = undefined;
        setTimeout(() => {
            this.modal = undefined;
            this.modal = new MeetingModal(this, ((username: string, confirm: boolean | undefined, isTie: boolean, noOfImpostorsRemain: number) => {
                this.modal?.removeModal?.();
                this.modal = new EjectModal(username, username == "" ? undefined : this.players[username].color, confirm, isTie, noOfImpostorsRemain);
                this.modal.removeModal = () => {
                    this.modal = undefined;
                    this.stage = "game";
                };
            }).bind(this));
            this.modal!.removeModal = () => {
                (this.modal as MeetingModal).onRemove();
                this.modal = undefined;
            };
        }, 2500);

        this.stage = "meeting";
    }
}

