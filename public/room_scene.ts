import { Scene, SceneController } from "./scene_controller.js";
import { GameScene } from "./game_scene.js";
import { MyWebSocket, MyWebSocketError } from "./websocket.js";

type p5 = any;

export class RoomScene implements Scene {
    usernameInput?: any;
    enterButton?: any;

    render(sketch: p5) {
        sketch.background(200);

        sketch.textSize(32);
        if (!this.usernameInput) {
            this.usernameInput = sketch.createInput('');
            this.usernameInput.size(300, 50);
            this.usernameInput.style("font-size", sketch.textSize() + "px");
            this.usernameInput.style("text-align", "center");
            this.usernameInput.attribute("placeholder", "USERNAME");
            (this.usernameInput.elt as HTMLElement).addEventListener("keyup", ((event: KeyboardEvent) => {
                if (event.key !== "Enter") return;
                this.onEnter.bind(this)();
                event.preventDefault();
            }).bind(this));
        }
        if (!this.enterButton) {
            this.enterButton = sketch.createButton("Enter Room");
            this.enterButton.size(300, 50);
            this.enterButton.style("font-size", sketch.textSize() + "px");
            this.enterButton.style("text-align", "center");
            this.enterButton.attribute("placeholder", "CODE");
            this.enterButton.mousePressed(this.onEnter.bind(this));
        }
        this.onWindowResized(sketch.windowWidth, sketch.windowHeight);

        sketch.textAlign(sketch.CENTER);
        sketch.fill(0);
        sketch.text("Enter the username", sketch.windowWidth/2, sketch.windowHeight/2 - 45);
    }
    onWindowResized(windowWidth: number, windowHeight: number) {
        this.usernameInput?.position(windowWidth/2-150, windowHeight/2-25);
        this.enterButton?.position(windowWidth/2-150, windowHeight/2+35);
    }
    
    onHide() {
        this.usernameInput?.remove();
        this.enterButton?.remove();
    }

    onEnter() {
        const username = this.usernameInput!.value();

        if (username.length > 10) {
            alert("Username can only be under 10 characters long.");
            return;
        } else if (username.length == 0) {
            alert("Please enter a username.");
            return;
        }

        MyWebSocket.instance.send("joinGame", { username: username }).then(() => {
            const gameScene = new GameScene(username);
            SceneController.instance.push(gameScene);
        }).catch((error: MyWebSocketError) => {
            console.log(error.data);
            alert(error.message);
        });
    }
}

