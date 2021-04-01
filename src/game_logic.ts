// For whatever reason, `import crypto from "crypto"` results in `crypto` being undefined.
// Future me should be more intelligent to figure this out. :)

import { wsClients } from ".";
import {Point} from "./point";

const UPDATE_INTERVAL = 50;

export type GameStage = "lobby" | "intro" | "game" | "meeting" | "ended";
export class Player {
    username: string;
    colorID: number;
    id: string;
    pos: Point;
    leftRight: boolean;
    isImpostor: boolean;
    isDead: boolean;
    deadPos?: Point;
    noRemainEmergency: number;

    constructor(data: {
        username: string,
        colorID: number,
        id: string,
        pos: Point,
        leftRight: boolean,
        isImpostor: boolean,
        isDead: boolean,
        deadPos?: Point,
        noRemainEmergency: number,
    }) {
        this.username = data.username;
        this.colorID = data.colorID;
        this.id = data.id;
        this.pos = data.pos;
        this.leftRight = data.leftRight;
        this.isImpostor = data.isImpostor;
        this.isDead = data.isDead;
        this.deadPos = data.deadPos;
        this.noRemainEmergency = data.noRemainEmergency;
    }
}

export type GameOptionValidate<T> = {
    value: T,
    validate: (value: T) => boolean,
};
export type GameOptions = {
    noImpostor: GameOptionValidate<number>,
    noEmergencyMeetings: GameOptionValidate<number>,
    discussionTime: GameOptionValidate<number>,
    votingTime: GameOptionValidate<number>,
    anonymousVoting: GameOptionValidate<boolean>,
    confirmEjects: GameOptionValidate<boolean>,
};
export type MeetingInfo = {
    discussionEndTime: number,
    votingEndTime: number | undefined, // Unlimited = undefined
    voting: {
        [username: string]: string | undefined, // skip = "", not voted = undefined
    },
    isVotingFinished: boolean,
    eject?: string, // skip = "", not finished voting = undefined
    votingTimeoutHandle?: NodeJS.Timeout,
    isTie?: boolean,
};

export class GameLogic {
    readonly KILL_DISTANCE = 200;
    private static _instance: GameLogic;
    static get instance() { return GameLogic._instance || (GameLogic._instance = new GameLogic()); }

    intervalHandles: NodeJS.Timeout[] = [];
    timeoutHandles: NodeJS.Timeout[] = [];

    players: { [username: string]: Player } = {};
    // @ts-expect-error because this is set in `this.reset()` and I don't want to copy all the properties here to make a dummy object.
    options: GameOptions;
    ownerUsername?: string;

    stage: GameStage = "lobby";
    startGameTime?: number;

    meetingInfo?: MeetingInfo;

    constructor() {
        this.reset();
    }

    reset() {
        this.players = {};
        this.options = {
            noImpostor: {
                value: 2,
                validate: (v) => 1 <= v && v <= 3,
            },
            noEmergencyMeetings: {
                value: 3,
                validate: (v) => 0 <= v && v <= 9,
            },
            discussionTime: {
                value: 15,
                validate: (v) => 0 <= v && v <= 120 && v % 15 == 0,
            },
            votingTime: {
                value: 120,
                validate: (v) => 0 <= v && v <= 300 && v % 15 == 0,
            },
            anonymousVoting: {
                value: false,
                validate: () => true,
            },
            confirmEjects: {
                value: true,
                validate: () => true,
            },
        };
        this.ownerUsername = undefined;
        this.stage = "lobby";

        this.timeoutHandles.forEach((timeout) => clearTimeout(timeout));
        this.intervalHandles.forEach((interval) => clearInterval(interval));

        this.intervalHandles.push(setInterval(this.sendUpdate.bind(this), UPDATE_INTERVAL));
    }

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

    getUsernameFromWSID(wsID: string): string | undefined {
        for (const username in this.players) {
            if (this.players[username].id === wsID) {
                return username;
            }
        }
        return undefined;
    }

    sendUpdate() {
        if (this.stage == "lobby" || this.stage == "game") {
            this.sendGameUpdate();
        } else if (this.stage == "intro") {
            this.sendIntroUpdate();
        } else if (this.stage == "meeting") {
            this.sendMeetingUpdate();
        }
    }

    sendGameUpdate() {
        let commonPayload: { [key: string]: any } = {};
        commonPayload.players = {};
        for (const username in this.players) {
            commonPayload.players[username] = {
                pos: {
                    x: this.players[username].pos.x,
                    y: this.players[username].pos.y,
                },
                leftRight: this.players[username].leftRight,
                colorID: this.players[username].colorID,
                isDead: this.players[username].isDead,
                deadPos: this.players[username].deadPos === undefined ? undefined : {
                    x: this.players[username].deadPos!.x,
                    y: this.players[username].deadPos!.y,
                },
            };
        }

        commonPayload.owner = this.ownerUsername!;

        commonPayload.options = {};
        for (const key in this.options) {
            commonPayload.options[key] = (this.options as any)[key].value;
        }

        for (const username in this.players) {
            const payload = {
                ...commonPayload,
                noRemainEmergency: this.players[username].noRemainEmergency,
            };
            const ws = wsClients[this.players[username].id];
            ws.send("gameUpdate", payload);
        }
    }

    sendIntroUpdate() {
        let crewmatePayload: { [key: string]: any } = { isImpostor: false, players: {} };
        let impostorPayload: { [key: string]: any } = { isImpostor: true, players: {} };
        let noImpostor = 0;
        for (const username in this.players) {
            crewmatePayload.players[username] = {
                colorID: this.players[username].colorID,
            };
            impostorPayload.players[username] = {
                colorID: this.players[username].colorID,
                isImpostor: this.players[username].isImpostor,
            };
            if (this.players[username].isImpostor) noImpostor++;
        }

        crewmatePayload.noImpostor = noImpostor;
        impostorPayload.noImpostor = noImpostor;
        for (const username in this.players) {
            const ws = wsClients[this.players[username].id];
            if (this.players[username].isImpostor) {
                ws.send("intro", impostorPayload);
            } else {
                ws.send("intro", crewmatePayload);
            }
        }
    }

    sendMeetingUpdate() {
        let payload: { [key: string]: any } = {};
        
        if (this.meetingInfo === undefined) throw new Error("meetingInfo is undefined, while stage is meeting.");
        payload.isVotingFinished = this.meetingInfo.isVotingFinished;
        if (this.meetingInfo.isVotingFinished) {
            payload.results = {};
            // results[some username] contains players who vote for that person
            // results[""] represents skip vote
            // results[some username] containing "" represents anonymous vote
            const results: { [username: string]: string[] } = {};
            for (const username in this.players) results[username] = [];
            for (const username in this.meetingInfo.voting) {
                const vote = this.meetingInfo.voting[username];
                if (vote === undefined) continue;
                if (results[vote] === undefined) results[vote] = [];
                results[vote].push(this.options.anonymousVoting.value ? "" : username);
            }
            payload.results = results;

            payload.eject = this.meetingInfo.eject!;
            payload.confirmEject = undefined;
            if (!this.options.confirmEjects) payload.confirmEject = undefined;
            else if (this.meetingInfo.eject === "") payload.confirmEject = false;
            else payload.confirmEject = this.players[this.meetingInfo.eject!].isImpostor;

            payload.isTie = this.meetingInfo.isTie!;
            payload.noOfImpostors = 0;
            for (const username in this.players) {
                if (username !== this.meetingInfo.eject && this.players[username].isImpostor && !this.players[username].isDead) payload.noOfImpostors++;
            }
        } else {
            payload.discussionEndTime = this.meetingInfo.discussionEndTime;
            payload.votingEndTime = this.meetingInfo.votingEndTime;
            payload.votedPlayers = {};
            for (const username in this.players) {
                payload.votedPlayers[username] = this.meetingInfo.voting[username] !== undefined;
            }
        }

        for (const username in this.players) {
            const ws = wsClients[this.players[username].id];
            ws.send("meetingUpdate", payload);
        }
    }

    playerJoinGame(id: string, username: string): {} {
        if (this.stage !== "lobby") throw "The game has started.";
        if (Object.keys(this.players).length == 10) throw "The game is full.";
        if (username.length > 10 || username.length == 0) {
            throw "Invalid username length.";
        }
        if (this.players[username] !== undefined) {
            throw "Username taken. Please try another one.";
        }

        let colorID = 0;
        while (true) {
            let isColorTaken = false;
            for (const username in this.players) {
                if (this.players[username].colorID == colorID) {
                    isColorTaken = true;
                    break;
                }
            }

            if (!isColorTaken) break;
            colorID++;
        }

        this.players[username] = new Player({
            username: username,
            id: id,
            pos: new Point(0, 0),
            leftRight: true,
            colorID: colorID,
            isImpostor: false,
            isDead: false,
            noRemainEmergency: 0,
        });

        if (this.ownerUsername === undefined) {
            this.ownerUsername = username;
            console.log(`[game] Player "${username}" has joined the game and is assigned as the owner`);
        } else {
            console.log(`[game] Player "${username}" has joined the game`);
        }
        return {};
    }

    playerDisconnect(id: string): {} {
        const username = this.getUsernameFromWSID(id);
        if (username === undefined) return {};
        delete this.players[username];
        console.log(`[game] Player "${username}" has left from the game due to disconnection`);
        if (username === this.ownerUsername) {
            if (Object.keys(this.players).length === 0) {
                this.reset();
                console.log(`[game] All players have left`);
            } else {
                this.ownerUsername = Object.keys(this.players)[0];
                console.log(`[game] Ownership is transferred to player "${this.ownerUsername!}"`);
            }
        }
        return {};
    }

    playerMove(id: string, x: number, y: number, leftRight: boolean): {} {
        if (!(this.stage == "lobby" || this.stage == "game")) throw new Error("Movement is not allowed during introduction, meeting or end screen.");
        const username = this.getUsernameFromWSID(id);
        if (username === undefined) return {};
        this.players[username]!.pos = new Point(x, y);
        this.players[username]!.leftRight = leftRight;
        return {};
    }

    playerChangeColor(id: string, colorID: number): {} {
        if (this.stage !== "lobby") throw new Error("The game has started.");
        const username = this.getUsernameFromWSID(id);
        if (!Number.isInteger(colorID) || colorID < 0 || colorID >= 12) throw new Error("Invalid color ID.");
        if (username === undefined) return {};
        
        let isColorTaken = false;
        for (const username in this.players) {
            if (this.players[username].colorID === colorID) {
                isColorTaken = true;
                break;
            }
        }

        if (isColorTaken) {
            throw new Error("Color is already taken.");
        }

        this.players[username].colorID = colorID;

        return {};
    }

    updateOption(id: string, key: string, value: number | boolean): {} {
        if (this.stage !== "lobby") throw new Error("The game has started.");
        if (!Object.keys(this.options).includes(key)) throw new Error("Invalid option key.");
        if (!this.ownerUsername) throw new Error("There is no existing game.");
        if (id !== this.players[this.ownerUsername].id) throw new Error("You do not have permission to change game options.");
        if (typeof (this.options as any)[key].value != typeof value) throw new Error("Invalid value type.");
        if (!(this.options as any)[key].validate(value)) throw new Error("Invalid value.");
        (this.options as any)[key].value = value;
        return {};
    }

    startGame(id: string): {} {
        if (this.stage !== "lobby") throw new Error("The game has started.");
        if (!this.ownerUsername) throw new Error("There is no existing game.");
        if (id !== this.players[this.ownerUsername].id) throw new Error("You do not have permission to start the game.");
        if (Object.keys(this.players).length < this.minNoPlayers(1))
            throw new Error("Not enough players for a game to start.");

        console.log("[game] Game is started");

        this.stage = "intro";
        const noImpostor = Math.min(this.maxNoImpostor(Object.keys(this.players).length), this.options.noImpostor.value);

        for (let i = 0; i < noImpostor; ++i) {
            let randomI;
            do {
                randomI = Math.floor(Math.random() * Object.keys(this.players).length);
            } while (this.players[Object.keys(this.players)[randomI]].isImpostor)

            this.players[Object.keys(this.players)[randomI]].isImpostor = true;
        }

        this.timeoutHandles.push(setTimeout(() => {
            this.stage = "game";
            let i = 0;
            for (const username in this.players) {
                const angle = 2 * Math.PI * i / Object.keys(this.players).length;
                this.players[username].pos = new Point(Math.cos(angle), Math.sin(angle)).multiply(200).add(new Point(23, -290)); // "center" of the map
                this.players[username].noRemainEmergency = this.options.noEmergencyMeetings.value;
                i++;
            }
        }, 7500));
        
        return {};
    }

    requestKill(id: string, targetUsername: string): { tpPos: { x: number, y: number }} {
        if (this.stage != "game") throw new Error("Killing is not allowed in lobby, meeting, introduction or end screen.");
        const username = this.getUsernameFromWSID(id);
        if (username === undefined) throw new Error("WebSocket ID unknown.");
        if (!(targetUsername in this.players)) throw new Error("Target username does not exist.");
        if (!this.players[username].isImpostor) throw new Error("Crewmates cannot kill.");
        if (this.players[username].isDead) throw new Error("Dead imposters cannot kill.");
        if (this.players[targetUsername].isImpostor) throw new Error("Imposters cannot be killed.");
        if (this.players[targetUsername].isDead) throw new Error("Dead crewmates cannot be killed.");

        if (this.players[username].pos.subtract(this.players[targetUsername].pos).norm() > this.KILL_DISTANCE)
            throw new Error("Cannot kill beyond kill distance.");

        this.players[targetUsername].isDead = true;
        this.players[targetUsername].deadPos = this.players[targetUsername].pos.add(new Point(0, 30));
        wsClients[this.players[targetUsername].id].send("killed", {
            killer: username,
        });

        this.players[username].pos = this.players[targetUsername].pos;

        return {
            tpPos: {
                x: this.players[targetUsername].pos.x,
                y: this.players[targetUsername].pos.y,
            },
        };
    }

    reportBody(id: string): {} {
        const REPORT_DISTANCE = 300;
        if (this.stage != "game") throw new Error("Reporting bodies is not allowed in lobby, meeting, introduction or end screen.");
        const username = this.getUsernameFromWSID(id);
        if (username === undefined) throw new Error("WebSocket ID unknown.");
        let reportTarget: string | undefined = undefined;
        let minDist = REPORT_DISTANCE;
        for (const u2 in this.players) {
            if (!this.players[u2].deadPos) continue;
            const dist = this.players[u2].pos.subtract(this.players[username].pos).norm();
            if (dist < minDist) {
                minDist  = dist;
                reportTarget = u2;
            }
        }
        if (reportTarget === undefined) throw new Error("No bodies to report.");
        
        this.startMeeting(reportTarget);
        
        return {};
    }

    callEmergency(id: string): {} {
        const EMERGENCY_DISTANCE = 250;
        if (this.stage != "game") throw new Error("Emergency meeting is not allowed in lobby, meeting, introduction or end screen.");
        const username = this.getUsernameFromWSID(id);
        if (username === undefined) throw new Error("WebSocket ID unknown.");
        if (this.players[username].isDead) throw new Error("Dead player cannot call meeting.");
        if (this.players[username].pos.subtract(new Point(23, -290)).norm() >= EMERGENCY_DISTANCE) throw new Error("Player stands too far away.");
        if (this.players[username].noRemainEmergency <= 0) throw new Error("Player has used up all emergency meetings.");

        this.players[username].noRemainEmergency--;
        this.startMeeting(undefined);

        return {};
    }

    private startMeeting(body: string | undefined) {
        this.stage = "meeting";
        for (const wsID in wsClients) {
            const ws = wsClients[wsID];
            ws.send("meetingCalled", { body: body });
        }

        this.meetingInfo = {
            discussionEndTime: Date.now() + (this.options.discussionTime.value + 3) * 1000,
            votingEndTime: (this.options.votingTime.value == 0) ? undefined : (Date.now() + (this.options.discussionTime.value + 3 + this.options.votingTime.value) * 1000),
            voting: (() => {
                let res: { [username: string]: undefined } = {};
                for (const username in this.players) {
                    if (this.players[username].isDead) continue;
                    res[username] = undefined;
                }
                return res;
            })(),
            isVotingFinished: false,
        };

        if (this.options.votingTime.value != 0) {
            const handle = setTimeout(this.meetingVoteEnd.bind(this), (this.options.discussionTime.value + 3 + this.options.votingTime.value) * 1000);
            this.meetingInfo.votingTimeoutHandle = handle;
            this.timeoutHandles.push(handle);
        }
    }

    private meetingVoteEnd() {
        if (this.stage !== "meeting") return;
        if (this.meetingInfo === undefined) throw new Error("meetingInfo is undefined, while stage is meeting.");

        const results: { [username: string]: number } = {};
        results[""] = 0;
        for (const username in this.players) results[username] = 0;
        for (const username in this.meetingInfo.voting) {
            const vote = this.meetingInfo.voting[username];
            if (vote === undefined) continue;
            results[vote]++;
        }

        let eject = ""; // "" = skip
        let tie = false;
        for (const username in results) {
            if (results[username] == results[eject]) {
                tie = true;
            } else if (results[username] > results[eject]) {
                eject = username;
                tie = false;
            }
        }

        if (tie) eject = "";
        this.meetingInfo.eject = eject;
        this.meetingInfo.isTie = tie;

        this.meetingInfo.isVotingFinished = true;

        this.timeoutHandles.push(setTimeout(() => {
            this.stage =  "game";
            if (this.meetingInfo!.eject! !== "") this.players[this.meetingInfo!.eject!].isDead = true;
            this.meetingInfo = undefined;

            let noOfAlivePlayers = 0;
            for (const username in this.players) {
                if (!this.players[username].isDead) noOfAlivePlayers++;
            }

            let i = 0;
            for (const username in this.players) {
                if (this.players[username].isDead) {
                    this.players[username].pos = new Point(23, -290);
                } else {
                    const angle = 2 * Math.PI * i / noOfAlivePlayers;
                    this.players[username].pos = new Point(Math.cos(angle), Math.sin(angle)).multiply(200).add(new Point(23, -290)); // "center" of the map
                    i++;
                }
            }
        }, 7000));
    }

    meetingVote(id: string, vote: string): {} {
        if (this.stage != "meeting") throw new Error("Vote cannot be casted in game, lobby, introduction or end screen.");
        const username = this.getUsernameFromWSID(id);
        if (username === undefined) throw new Error("WebSocket ID unknown.");
        if (this.players[username].isDead) throw new Error("Dead players cannot vote.");

        if (this.meetingInfo === undefined) throw new Error("meetingInfo not initialiated. This is an internal error.");
        if (this.meetingInfo.voting[username] !== undefined) throw new Error("Vote cannot be casted multiple times.");
        if (Date.now() < this.meetingInfo.discussionEndTime) throw new Error("Cannot vote in discussion.");
        if (this.meetingInfo.votingEndTime && Date.now() > this.meetingInfo.votingEndTime) throw new Error("Cannot vote after voting time.");

        this.meetingInfo.voting[username] = vote;
        let hasAllVoted = true;
        for (const username in this.meetingInfo.voting) {
            if (this.meetingInfo.voting[username] === undefined) {
                hasAllVoted = false;
                break;
            }
        }
        if (hasAllVoted) {
            this.meetingVoteEnd();
        }

        return {};
    }
}
