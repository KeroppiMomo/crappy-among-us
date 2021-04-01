import { Point } from "../point.js";
import { NormalModal } from "./normal_modal.js";
import {AlienColor, AlienColorSwatch} from "../alien_colors.js";
import {GameScene} from "../game_scene.js";
import * as drawSprite from "../draw_sprite.js";
import {MyWebSocket, MyWebSocketError} from "../websocket.js";
import {Color} from "../view.js";
type p5 = any;

const ANONYMOUS_SWATCH: AlienColorSwatch = {
    primary: new Color(107, 107, 107),
    shadow: new Color(107, 107, 107),
    inside: new Color(107, 107, 107),
};
export class MeetingModal extends NormalModal {
    removeModal?: () => void;
    blockKey = true;

    discussionEndTime?: number;
    votingEndTime?: number | undefined;
    resultEndTime?: number;

    players: {
        [username: string]: {
            color: AlienColor,
            isDead: boolean,
            isImpostor: boolean,
            hasVoted: boolean,
            votedBy: string[]
        };
    } = {};

    isVotingFinished: boolean = false;
    skipVotedBy: string[] = [];
    eject?: string;
    confirmEject?: boolean;
    isTie?: boolean;
    noOfImpostorsRemain?: number;

    username: string;

    private selected: string | undefined = undefined;

    constructor(scene: GameScene, 
                public showEjectModal: (username: string, confirm: boolean | undefined, isTie: boolean, noOfImpostorsRemain: number) => void) {
        super();
        this.enableCloseButton = false;
        this.enableEscClosing = false;
        this.contentWidth = 1000;
        this.contentHeight = 700;
        this.enableFlyIn = false;

        for (const username in scene.players) {
            this.players[username] = {
                color: scene.players[username].color,
                isDead: scene.players[username].isDead,
                isImpostor: scene.players[username].isImpostor,
                hasVoted: false,
                votedBy: [],
            };
        }

        this.username = scene.username;

        this.showEjectModal = showEjectModal;

        MyWebSocket.instance.addListener("meetingUpdate", this.onServerUpdate.bind(this));
    }

    private get orderedUsername() {
        return Object.keys(this.players).sort((a, b) => {
            if (this.players[a].isDead && this.players[b].isDead) return a.localeCompare(b);
            if (this.players[a].isDead) return 1;
            if (this.players[b].isDead) return -1;
            return a.localeCompare(b);
        });
    }

    onRemove() {
        MyWebSocket.instance.removeListener("meetingUpdate", this.onServerUpdate.bind(this));
    }

    onServerUpdate(data: { [username: string]: any }) {
        const isVotingFinished = data.isVotingFinished;
        if (typeof isVotingFinished != "boolean") throw new MyWebSocketError("Unable to parse incoming message.", data);
        this.isVotingFinished = isVotingFinished;
        
        if (isVotingFinished) {
            this.selected = undefined;
            if (this.resultEndTime === undefined) {
                this.resultEndTime = Date.now() + 5000;
            }

            const results = data.results;
            if (typeof results !== "object") throw new MyWebSocketError("Unable to parse incoming message.", data);
            for (const username in results) {
                if (username == "") this.skipVotedBy = results[username];
                else this.players[username].votedBy = results[username];
            }

            const eject = data.eject;
            const confirmEject = data.confirmEject;
            if (typeof eject !== "string" || !(typeof confirmEject === "boolean" || confirmEject === undefined)) throw new MyWebSocketError("Unable to parse incoming message.", data);

            this.eject = eject;
            this.confirmEject = confirmEject;

            const isTie = data.isTie;
            const noOfImpostors = data.noOfImpostors;
            if (typeof isTie !== "boolean" || typeof noOfImpostors !== "number") throw new MyWebSocketError("Unable to parse incoming message.", data);

            this.isTie = isTie;
            this.noOfImpostorsRemain = noOfImpostors;
        } else {
            const discussionEndTime = data.discussionEndTime;
            const votingEndTime = data.votingEndTime;
            if (typeof discussionEndTime != "number" || (typeof votingEndTime != "number" && votingEndTime != undefined)) throw new MyWebSocketError("Unable to parse incoming message.", data);
            this.discussionEndTime = discussionEndTime;
            this.votingEndTime = votingEndTime;
            
            const votedPlayers = data.votedPlayers;
            if (typeof votedPlayers != "object") throw new MyWebSocketError("Unable to parse incoming message.", data);
            for (const username in votedPlayers) {
                if (typeof votedPlayers[username] != "boolean") throw new MyWebSocketError("Unable to parse incoming message.", data);
                this.players[username].hasVoted = votedPlayers[username];
            }
        }
    }

    render(sketch: p5) {
        sketch.fill(0, 160);
        sketch.noStroke();
        sketch.rect(0, 0, sketch.windowWidth, sketch.windowHeight);

        super.render(sketch);

        // Outer border
        sketch.fill(146, 152, 163);
        sketch.stroke(0);
        sketch.strokeWeight(10);
        sketch.rect(-500, -350, 1000, 700);

        // Inner border
        sketch.fill(175, 199, 228);
        sketch.stroke(85, 91, 107);
        sketch.strokeWeight(10);
        sketch.rect(-470, -325, 940, 650);

        // Title
        sketch.fill(255);
        sketch.stroke(0);
        sketch.strokeWeight(5);
        sketch.textAlign(sketch.CENTER, sketch.BASELINE);
        sketch.textSize(50);
        sketch.text("Who is The Imposter?", 0, -260);

        // Players
        let i = 0;
        for (const username of this.orderedUsername) {
            let x = (i % 2 == 0) ? -450 : 10;
            let y = -225 + Math.floor(i/2) * 90;

            sketch.fill(255, 200);
            sketch.stroke(0);
            sketch.strokeWeight(3);
            sketch.rect(x, y, 440, 80);

            drawSprite.alien(sketch, this.players[username].color.swatch, true, 1, new Point(x+15, y+10), 48, 60);

            if (this.players[username].isImpostor) sketch.fill(255, 0, 0);
            else sketch.fill(255);
            sketch.stroke(0);
            sketch.strokeWeight(4);
            sketch.textSize(32);
            sketch.textAlign(sketch.LEFT, sketch.BASELINE);
            sketch.text(username, x+80, y+35);

            let votedIndex = 0;
            for (const voted of this.players[username].votedBy) {
                drawSprite.alien(
                    sketch,
                    (voted == "") ? ANONYMOUS_SWATCH : this.players[voted].color.swatch,
                    true,
                    1,
                    new Point(x+80, y+45).add(new Point(26, 0).multiply(votedIndex)),
                    23.8,
                    30
                );
                votedIndex++;
            }

            if (!this.isVotingFinished && this.players[username].hasVoted) {
                sketch.stroke(143, 76, 89);
                sketch.strokeWeight(2);
                sketch.fill(231, 210, 222);
                sketch.ellipse(x+10, y+10, 40);

                sketch.fill(143, 76, 89);
                sketch.stroke(143, 76, 89);
                sketch.strokeWeight(1);
                sketch.textAlign(sketch.CENTER, sketch.CENTER);
                sketch.textSize(9);
                sketch.push();
                sketch.translate(x+10, y+10);
                sketch.rotate(-Math.PI/6);
                sketch.text("I\nVOTED", 0, 0);
                sketch.pop();
            }

            if (this.selected == username) {
                this.renderConfirmButtons(sketch, x+285, y+10);
            }

            if (this.players[username].isDead) {
                // Cross
                sketch.stroke(180, 0, 0);
                sketch.strokeWeight(8);
                sketch.line(x+15, y+10, x+15+48, y+10+60);
                sketch.line(x+15+48, y+10, x+15, y+10+60);
            }

            if (this.players[username].isDead || this.discussionEndTime === undefined || Date.now() < this.discussionEndTime) {
                sketch.fill(0, 130);
                sketch.noStroke();
                sketch.rect(x, y, 440, 80);
            }

            i++;
        }

        if (this.isVotingFinished) {
            sketch.fill(255);
            sketch.stroke(0);
            sketch.strokeWeight(3);
            sketch.textAlign(sketch.CENTER, sketch.BASELINE);
            sketch.textSize(18);
            sketch.text("Skipped\nVote:", -400, 265);
            
            let votedIndex = 0;
            for (const username of this.skipVotedBy) {
                drawSprite.alien(
                    sketch,
                    (username == "") ? ANONYMOUS_SWATCH : this.players[username].color.swatch,
                    true,
                    1,
                    new Point(-350, 255).add(new Point(26, 0).multiply(votedIndex)),
                    23.8,
                    30
                );
                votedIndex++;
            }
        } else if (!this.players[this.username].hasVoted) {
            // Skip Vote
            if (this.discussionEndTime === undefined || Date.now() < this.discussionEndTime) sketch.fill(100);
            else sketch.fill(171, 178, 184);
            sketch.stroke(0);
            sketch.strokeWeight(3);
            sketch.rect(-450, 250, 180, 50);

            sketch.fill(0);
            sketch.noStroke();
            sketch.textAlign(sketch.CENTER, sketch.BASELINE);
            sketch.textSize(28);
            sketch.text("Skip Vote", -360, 285);

            if (this.selected === "") {
                this.renderConfirmButtons(sketch, -220, 240);
            }
        }

        // Timer text
        const timerText = (() => {
            if (this.discussionEndTime == undefined) return "";
            if (Date.now() < this.discussionEndTime) return `Discussion Ends In: ${Math.floor((this.discussionEndTime - Date.now())/1000)}s`;
            if (this.votingEndTime == undefined) return "Voting Ends When All Has Voted";
            if (this.resultEndTime !== undefined) return `Proceed In: ${Math.floor(Math.max(0, this.resultEndTime - Date.now())/1000)}s`;
            if (Date.now() < this.votingEndTime) return `Voting Ends In: ${Math.floor((this.votingEndTime - Date.now())/1000)}s`;
            return "Voting Ends In: 0s";
        })();
        sketch.fill(255);
        sketch.stroke(0);
        sketch.strokeWeight(3);
        sketch.textAlign(sketch.RIGHT, sketch.BASELINE);
        sketch.textSize(28);
        sketch.text(timerText, 450, 285);

        if (this.resultEndTime !== undefined && Date.now() >= this.resultEndTime) {
            if (Date.now() < this.resultEndTime + 1000) {
                sketch.push();
                sketch.resetMatrix();
                sketch.fill(0, (Date.now() - this.resultEndTime) / 1000 * 255);
                sketch.rect(0, 0, sketch.windowWidth, sketch.windowHeight);
                sketch.pop();
            } else {
                this.showEjectModal(this.eject!, this.confirmEject, this.isTie!, this.noOfImpostorsRemain!);
                sketch.push();
                sketch.resetMatrix();
                sketch.fill(0);
                sketch.rect(0, 0, sketch.windowWidth, sketch.windowHeight);
                sketch.pop();
            }
        }
    }

    renderConfirmButtons(sketch: p5, x: number, y: number) {
        // Cancel button
        sketch.fill(226, 184, 190);
        sketch.stroke(101, 62, 69);
        sketch.strokeWeight(4);
        sketch.rect(x+80, y, 60, 60, 3);

        sketch.stroke(168, 73, 79);
        sketch.strokeWeight(4);
        sketch.line(x+90, y+10, x+130, y+50);
        sketch.line(x+130, y+10, x+90, y+50);

        // Tick button
        sketch.fill(181, 211, 196);
        sketch.stroke(73, 98, 90);
        sketch.strokeWeight(4);
        sketch.rect(x, y, 60, 60, 3);

        sketch.stroke(83, 129, 95);
        sketch.strokeWeight(4);
        sketch.line(x+10, y+30, x+25, y+50);
        sketch.line(x+25, y+50, x+50, y+10);
    }

    isMouseOnConfirmCancelButton(pos: Point, x: number, y: number) {
        return pos.x >= x+80 && pos.x <= x+140 && pos.y >= y && pos.y <= y+60;
    }
    isMouseOnConfirmTickButton(pos: Point, x: number, y: number) {
        return pos.x >= x && pos.x <= x+60 && pos.y >= y && pos.y <= y+60;
    }
    
    onMousePressed(sketch: p5) {
        super.onMousePressed(sketch);
        const mousePosUnderTransform = super.screenToModalPos(sketch, new Point(sketch.mouseX, sketch.mouseY));

        if (!this.players[this.username].isDead
            && !this.players[this.username].hasVoted 
            && this.discussionEndTime && Date.now() >= this.discussionEndTime 
            && (this.votingEndTime == undefined || Date.now() < this.votingEndTime)
            && !this.isVotingFinished) {
            let i = 0;
            for (const username of this.orderedUsername) {
                if (this.players[username].isDead) continue;
                let x = (i % 2 == 0) ? -450 : 10;
                let y = -225 + Math.floor(i/2) * 90;

                if (username == this.selected) {
                    if (this.isMouseOnConfirmCancelButton(mousePosUnderTransform, x+285, y+10)) {
                        this.selected = undefined;
                        return;
                    } else if (this.isMouseOnConfirmTickButton(mousePosUnderTransform, x+285, y+10)) {
                        MyWebSocket.instance.send("meetingVote", {
                            vote: username,
                        });
                        this.selected = undefined;
                        return;
                    }
                }
                if (mousePosUnderTransform.x >= x && mousePosUnderTransform.x <= x+440
                    && mousePosUnderTransform.y >= y && mousePosUnderTransform.y <= y+80) {
                    this.selected = username;
                    return;
                }
                i++;
            }

            if (this.selected === "") {
                if (this.isMouseOnConfirmCancelButton(mousePosUnderTransform, -220, 240)) {
                    this.selected = undefined;
                    return;
                } else if (this.isMouseOnConfirmTickButton(mousePosUnderTransform, -220, 240)) {
                    MyWebSocket.instance.send("meetingVote", {
                        vote: "",
                    });
                    this.selected = undefined;
                    return;
                }
            }
            if (mousePosUnderTransform.x >= -450 && mousePosUnderTransform.x <= -450+180
                && mousePosUnderTransform.y >= 250 && mousePosUnderTransform.y <= 250+50) {
                this.selected = "";
            }
        }
    }
}
