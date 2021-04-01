export class MyWebSocketError extends Error {
    data: Object;

    constructor(message: string, data: Object) {
        super(message);
        this.data = data;
    }
}
export class MyWebSocket {
    static instance = new MyWebSocket();

    ws: WebSocket;
    private _id = 0;

    constructor() {
        if (location.protocol === "http:") {
            this.ws = new WebSocket("ws://" + location.host);
        } else {
            this.ws = new WebSocket("wss://" + location.host);
        }
        this.ws.addEventListener("close", this.onClose);
    }

    _nextID(): number {
        return this._id++;
    }

    async send(type: string, arg: { [key: string]: any }): Promise<{ [key: string]: Object }> {
        const id = this._nextID();
        this.ws.send(JSON.stringify({
            id: id,
            type: type,
            ...arg,
        }));

        return new Promise<{ [key: string]: Object }>((resolve, reject) => {
            const that = this;
            function handler(event: MessageEvent) {
                const data = JSON.parse(event.data.toString());
                if (typeof data != "object") {
                    that.ws.removeEventListener("message", handler);
                    reject(new MyWebSocketError("Unable to parse incoming message.", data));
                    return;
                }

                if (data.id !== id) return;
                that.ws.removeEventListener("message", handler);

                if (data.type === "error") {
                    if (typeof data.message != "string") {
                        reject(new MyWebSocketError("Unable to parse incoming message.", data));
                        return;
                    }
                    reject(new MyWebSocketError(data.message, data));
                } else if (data.type === "response") {
                    resolve(data);
                } else {
                    reject(new MyWebSocketError("Unknown type.", data));
                }
            }
            this.ws.addEventListener("message", handler);
        });
    }

    addListener(type: string, listener: (data: { [key: string]: Object }) => void) {
        this.ws.addEventListener("message", (event: MessageEvent) => {
            const data = JSON.parse(event.data.toString());
            if (data.type === type) {
                listener(data);
            }
        });
    }

    removeListener(type: string, listener: (data: { [key: string]: Object}) => void) {
        this.ws.removeEventListener("message", (event: MessageEvent) => {
            const data = JSON.parse(event.data.toString());
            if (data.type === type) {
                listener(data);
            }
        });
    }

    onClose() {
        // alert("Connection lost. Click OK to refresh the page.");
        location.reload();
    }
}
