import { GameLogic } from "./game_logic";

/// Divert the WebSocket messages by their type. For "close" event, use type "wsClose".
///
/// Error is thrown through the class `Error` with a message.
export function typeHandler(wsID: string, type: string, arg: { [key: string]: Object }): { [key: string]: Object } {
    switch (type) {
        case "joinGame":
            if (typeof arg.username != "string") throw Error("Unable to parse incoming message.");
            return GameLogic.instance.playerJoinGame(wsID, arg.username);
        case "playerMove":
            if (typeof arg.x != "number" || typeof arg.y != "number" || typeof arg.leftRight != "boolean") throw Error("Unable to parse incoming message.");
            return GameLogic.instance.playerMove(wsID, arg.x, arg.y, arg.leftRight);
        case "changeColor":
            if (typeof arg.colorID != "number") throw Error("Unable to parse incoming message.");
            return GameLogic.instance.playerChangeColor(wsID, arg.colorID);
        case "updateOption":
            if (typeof arg.key != "string" || !(typeof arg.value == "boolean" || typeof arg.value == "number")) throw Error("Unable to parse incoming message.");
            return GameLogic.instance.updateOption(wsID, arg.key, arg.value);
        case "startGame":
            return GameLogic.instance.startGame(wsID);
        case "kill":
            if (typeof arg.target != "string") throw Error("Unable to parse incoming message.");
            return GameLogic.instance.requestKill(wsID, arg.target);
        case "reportBody":
            return GameLogic.instance.reportBody(wsID);
        case "callEmergency":
            return GameLogic.instance.callEmergency(wsID);
        case "meetingVote":
            if (typeof arg.vote != "string") throw Error("Unable to parse incoming message.");
            return GameLogic.instance.meetingVote(wsID, arg.vote);
        case "wsClose":
            return GameLogic.instance.playerDisconnect(wsID);
        default:
            throw Error("Unknown type.");
    }
}
