import { Scene, SceneController } from "./scene_controller.js";
import { RoomScene } from "./room_scene.js";
import { MyWebSocket } from "./websocket.js";

type p5 = any;

export class LoadingScene implements Scene {
    onShow() {
        if (MyWebSocket.instance.ws.readyState !== WebSocket.OPEN) {
            MyWebSocket.instance.ws.addEventListener("open", () => {
                SceneController.instance.push(new RoomScene());
                SceneController.instance.pop(this);
            });
        } else {
            setTimeout(() => {
                SceneController.instance.push(new RoomScene());
                SceneController.instance.pop(this);
            });
        }
    }
    render(sketch: p5) {
        sketch.background(200);
    }
}

