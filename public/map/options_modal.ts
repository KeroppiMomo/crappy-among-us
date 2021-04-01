import { NormalModal } from "./normal_modal.js";
import { Images } from "../resources.js";
import { AlienColor } from "../alien_colors.js";
import { Point } from "../point.js";
import { GameScene, GameOptions } from "../game_scene.js";
import { MyWebSocket } from "../websocket.js";
import * as drawSprite from "../draw_sprite.js";
type p5 = any;

type OptionInfo = {
    name: string,
    key: keyof GameOptions,
    getter: () => number | boolean,
    formatter: (v: number) => string,
    allowInc: (v: number) => boolean,
    increment: () => void,
    allowDec: (v: number) => boolean,
    decrement: () => void,
};

export class OptionsModal extends NormalModal {
    readonly options: OptionInfo[] = [
        {
            name: "# Impostors",
            key: "noImpostor",
            getter: () => this.scene.options.noImpostor,
            formatter: (v) => v.toString(),
            allowInc: (v) => v < 3,
            increment: () => { this.scene.options.noImpostor++ },
            allowDec: (v) => v > 1,
            decrement: () => { this.scene.options.noImpostor-- },
        },
        {
            name: "# Emergency Meetings",
            key: "noEmergencyMeetings",
            getter: () => this.scene.options.noEmergencyMeetings,
            formatter: (v) => v.toString(),
            allowInc: (v) => v < 9,
            increment: () => { this.scene.options.noEmergencyMeetings++ },
            allowDec: (v) => v > 0,
            decrement: () => { this.scene.options.noEmergencyMeetings-- },
        },
        {
            name: "Discussion Time",
            key: "discussionTime",
            getter: () => this.scene.options.discussionTime,
            formatter: (v) => `${v}s`,
            allowInc: (v) => v < 120,
            increment: () => { this.scene.options.discussionTime += 15 },
            allowDec: (v) => v > 0,
            decrement: () => { this.scene.options.discussionTime -= 15 },
        },
        {
            name: "Voting Time",
            key: "votingTime",
            getter: () => this.scene.options.votingTime,
            formatter: (v) => v == 0 ? "∞" : `${v}s`,
            allowInc: (v) => v < 300,
            increment: () => { this.scene.options.votingTime += 15 },
            allowDec: (v) => v > 0,
            decrement: () => { this.scene.options.votingTime -= 15 },
        },
        {
            name: "Anonymous Voting",
            key: "anonymousVoting",
            getter: () => this.scene.options.anonymousVoting,
            formatter: () => "",
            allowInc: () => true,
            increment: () => { this.scene.options.anonymousVoting = !this.scene.options.anonymousVoting },
            allowDec: () => true,
            decrement: () => { this.scene.options.anonymousVoting = !this.scene.options.anonymousVoting },
        },
        {
            name: "Confirm Ejects",
            key: "confirmEjects",
            getter: () => this.scene.options.confirmEjects,
            formatter: () => "",
            allowInc: () => true,
            increment: () => { this.scene.options.confirmEjects = !this.scene.options.confirmEjects },
            allowDec: () => true,
            decrement: () => { this.scene.options.confirmEjects = !this.scene.options.confirmEjects },
        },
    ];

    blockKey = true;
    
    tab: "color" | "game";

    scene: GameScene;

    constructor(scene: GameScene) {
        super();
        this.scene = scene;
        this.contentWidth = 1000;
        this.contentHeight = 800;
        this.tab = "color";
    }
    render(sketch: p5) {
        super.render(sketch);

        // Background
        sketch.fill(209, 224, 210, 220);
        sketch.noStroke();
        sketch.rect(-500, -400, 1000, 800);

        // Tabs
        sketch.noStroke();
        if (this.tab == "color") sketch.fill(0, 130);
        else sketch.fill(0, 30);
        sketch.rect(-470, -375, 465, 100, 5);
        if (this.tab == "game") sketch.fill(0, 130);
        else sketch.fill(0, 30);
        sketch.rect(470, -375, -465, 100, 5);

        sketch.fill(255);
        sketch.stroke(0);
        sketch.strokeWeight(5);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.textSize(50);
        sketch.text("Color", -237.5, -325);
        sketch.text("Game", 237.5, -325);

        if (this.tab == "color") {
            // Color tab
            sketch.fill(0, 80);
            sketch.noStroke();
            sketch.rect(-470, -250, 450, 620, 5);
            sketch.rect(470, -250, -450, 620, 5);

            // Left side - Alien
            const myColor = this.scene.players[this.scene.username].color;
            
            drawSprite.alien(sketch, myColor.swatch, true, 1, new Point(-380, -20), 270, 337.5);

            for (let colorID = 0; colorID < 12; ++colorID) {
                const color = AlienColor.fromID(colorID)!;
                const x = 20 + 60 + (colorID%3)*(90+30);
                const y = -250 + 50 + Math.floor(colorID/3)*(90+30);
                sketch.stroke(0);
                sketch.strokeWeight(8);
                sketch.fill(...color.swatch.primary.fourColor);
                sketch.rect(x, y, 90, 90, 10);

                let isColorTaken = false;
                for (const username in this.scene.players) {
                    if (this.scene.players[username].color === color) {
                        isColorTaken = true;
                        break;
                    }
                }
                if (isColorTaken) {
                    sketch.fill(0, 100);
                    sketch.stroke(0, 200);
                    sketch.strokeWeight(3);
                    sketch.circle(x + 45, y + 45, 80);
                    sketch.strokeWeight(10);
                    sketch.strokeCap(sketch.SQUARE);
                    sketch.line(x + 25, y + 25, x + 65, y + 65);
                    sketch.line(x + 65, y + 25, x + 25, y + 65);
                    sketch.strokeCap(sketch.ROUND);
                }
            }
        } else if (this.tab == "game") {
            sketch.fill(0, 80);
            sketch.noStroke();
            sketch.rect(-470, -250, 940, 620, 5);

            let y = -230;
            for (const op of this.options) {
                sketch.fill(0, 50);
                sketch.noStroke();
                sketch.rect(-450, y, 900, 80, 5);

                sketch.fill(255);
                sketch.stroke(0);
                sketch.strokeWeight(5);
                sketch.textSize(40);
                sketch.textAlign(sketch.LEFT, sketch.BASELINE);
                sketch.text(op.name, -430, y + 52);

                const value = op.getter();
                if (typeof value == "boolean") {
                    sketch.stroke(0);
                    sketch.strokeWeight(5);
                    sketch.fill(151, 176, 152)
                    sketch.rect(312.5-50/2, y+40-50/2, 50, 50, 5)

                    if (value) {
                        sketch.strokeWeight(10);
                        sketch.line(312.5-50/2+5, y+40-5, 312.5, y+40+50/2-5);
                        sketch.line(312.5, y+40+50/2-5, 312.5+50-5, y+40-50/2);
                    }
                } else {
                    sketch.textAlign(sketch.CENTER);
                    sketch.text(op.formatter(value), 312.5, y+52);
                    
                    if (this.scene.ownerUsername == this.scene.username) {
                        sketch.strokeWeight(5);
                        if (op.allowDec(value)) {
                            sketch.fill(255);
                            sketch.stroke(0);
                        } else {
                            sketch.fill(255, 100);
                            sketch.stroke(0, 100);
                        }
                        sketch.rect(195, y+35, 30, 10);

                        if (op.allowInc(value)) {
                            sketch.fill(255);
                            sketch.stroke(0);
                        } else {
                            sketch.fill(255, 100);
                            sketch.stroke(0, 100);
                        }
                        sketch.beginShape();
                        sketch.vertex(400, y+35);
                        sketch.vertex(400, y+45);
                        sketch.vertex(410, y+45);
                        sketch.vertex(410, y+55);
                        sketch.vertex(420, y+55);
                        sketch.vertex(420, y+45);
                        sketch.vertex(430, y+45);
                        sketch.vertex(430, y+35);
                        sketch.vertex(420, y+35);
                        sketch.vertex(420, y+25);
                        sketch.vertex(410, y+25);
                        sketch.vertex(410, y+35);
                        sketch.endShape(sketch.CLOSE);
                    }
                }
                y += 80 + 10;
            }

            if (this.scene.ownerUsername != this.scene.username) {
                sketch.fill(255);
                sketch.stroke(0);
                sketch.strokeWeight(3);
                sketch.textAlign(sketch.CENTER, sketch.BASELINE);
                sketch.textSize(20);
                sketch.text("You do not have permission to change game options. Contact the owner for changes.", 0, y + 52);
            }
        } else {
            // In case I implement more tabs in the future
            throw new Error("Unknown tab");
        }
    }

    onMousePressed(sketch: p5) {
        super.onMousePressed(sketch);

        const mousePosUnderTransform = super.screenToModalPos(sketch, new Point(sketch.mouseX, sketch.mouseY));

        // Returns true when the click is recognized

        if (this.checkTabClick(mousePosUnderTransform)) return;
        if (this.tab == "color" && this.checkColorClick(mousePosUnderTransform)) return;
        if (this.tab == "game" && this.checkOptionClick(mousePosUnderTransform)) return;
    }

    checkTabClick(mousePos: Point): boolean {
        if (mousePos.x >= -470 && mousePos.x <= -5 && mousePos.y >= -375 && mousePos.y <= -275) {
            this.tab = "color";
            return true;
        }

        if (mousePos.x >= 5 && mousePos.x <= 470 && mousePos.y >= -375 && mousePos.y <= -275) {
            this.tab = "game";
            return true;
        }
        
        return false;
    }

    checkColorClick(mousePos: Point): boolean {
        let newColor: AlienColor | undefined;
        for (let colorID = 0; colorID < 12; ++colorID) {
            const x = 20 + 60 + (colorID%3)*(90+30);
            const y = -250 + 50 + Math.floor(colorID/3)*(90+30);
            if (mousePos.x >= x && mousePos.x <= x + 90
                && mousePos.y >= y && mousePos.y <= y + 90) {
                newColor = AlienColor.fromID(colorID);
                break;
            }
        }

        if (!newColor) return false;

        let isColorTaken = false;
        for (const username in this.scene.players) {
            if (this.scene.players[username].color === newColor) {
                isColorTaken = true;
                break;
            }
        }

        if (isColorTaken) return true;

        // This line is commented out to avoid the UI from flickering and wait for server response

        // this.scene.players[this.scene.username].color = newColor;
        
        MyWebSocket.instance.send("changeColor", { colorID: newColor.colorID }).catch((error) => {
            console.error(error);
        });
        
        return true;
    }

    checkOptionClick(mousePos: Point): boolean {
        if (this.scene.ownerUsername != this.scene.username) return false;

        const sendUpdate = (option: OptionInfo) => {
            MyWebSocket.instance.send(
                "updateOption",
                {
                    key: option.key,
                    value: option.getter(),
                },
            );
        }

        let y = -230;
        for (const op of this.options) {
            // Increment and then decrement to avoid the UI from flickering and wait for server response
            if (typeof op.getter() == "boolean") {
                if (mousePos.x >= 312.5 - 50/2 && mousePos.x <= 312.5 + 50/2
                    && mousePos.y >= y+40-50/2 && mousePos.y <= y+40+50/2) {
                    op.increment();
                    sendUpdate(op);
                    op.decrement();
                    return true;
                }
            } else {
                if (mousePos.subtract(new Point(200, y+40)).norm() < 20) {
                    if (op.allowDec(op.getter() as number)) {
                        op.decrement();
                        sendUpdate(op);
                        op.increment();
                    }
                    return true;
                }
                if (mousePos.subtract(new Point(415, y+40)).norm() < 20) {
                    if (op.allowInc(op.getter() as number)) {
                        op.increment();
                        sendUpdate(op);
                        op.decrement();
                    }
                    return true;
                }
            }

            y += 80 + 10;
        }

        return false;
    }
}
