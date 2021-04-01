import express = require("express");
import WebSocket = require("../node_modules/@types/ws");
import { Server as SocketServer } from "ws";
const app = express();
import { typeHandler } from "./type_handler";
import {generateToken} from "./token";

app.use(express.static("./public"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log("[server] Started server");
});

const wss = new SocketServer({ server });

export let wsClients: { [id: string]: MyWebSocket } = {};

/// Wrapper on WebSocket to provide uniformed protocol across client and server.
export class MyWebSocket {
    id: string;
    ws: WebSocket;

    constructor(ws: WebSocket) {
        this.ws = ws;
        this.id = generateToken(16);
        console.log(`[ws] Client connected and is given id ${this.id}`);

        this.ws.on("message", this.onMessage.bind(this));
        this.ws.on("close", this.onClose.bind(this));
    }

    private onMessage(rawData: WebSocket.Data) {
        const data: any = JSON.parse(rawData.valueOf().toString());
        if (typeof data != "object") {
            this.ws.send(JSON.stringify({
                type: "error",
                message: "Unable to parse incoming message.",
                data: data,
            }));
            return;
        }
        if (typeof data.type != "string" || typeof data.id != "number") {
            this.ws.send(JSON.stringify({
                type: "error",
                message: "Unable to parse incoming message.",
                data: data,
            }));
            return;
        }

        const type = data.type as string;
        const id = data.id as number;

        try {
            const result = typeHandler(this.id, type, data);
            this.ws.send(JSON.stringify({
                type: "response",
                id: id,
                ...result,
            }));
        } catch (error) {
            if (!(error instanceof Error)) {
                this.ws.send(JSON.stringify({
                    type: "error",
                    id: id,
                    message: error,
                    data: data,
                }));
            } else {
                this.ws.send(JSON.stringify({
                    type: "error",
                    id: id,
                    message: (error as Error).message,
                    data: data,
                }));
            }
        }
    }

    private onClose(code: number, reason: string) {
        console.log(`[ws] WebSocket ${this.id} is closed with code ${code} and reason "${reason}"`);
        typeHandler(this.id, "wsClose", {});
    }

    send(type: string, arg: { [key: string]: Object | undefined }) {
        this.ws.send(JSON.stringify({
            type: type,
            ...arg,
        }));
    }
}

wss.on("connection", (ws) => {
    const myWS = new MyWebSocket(ws);
    wsClients[myWS.id] = myWS;
});

