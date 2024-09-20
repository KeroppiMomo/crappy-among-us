

# Crappy Among Us
A bad and unfinished knock-off of the multiplayer game Among Us.

This is just a personal project to use p5.js, learn about WebSocket, and take a glimpse of multiplayer game development.

## Demo
### Starting a game
https://github.com/user-attachments/assets/0ce37999-8b95-4a2e-a4bb-70a15e94a2e4

### Tasks
https://github.com/user-attachments/assets/47687ceb-dfe4-477f-abfc-c5ba1ecdd551

### Killing
https://github.com/user-attachments/assets/061824f7-5222-49b6-bcf1-3444e7e9ffea

### Voting
https://github.com/user-attachments/assets/739dd45b-8176-4e68-bf72-3441b4d83e2f

## Technical details
- UI rendering is done by [p5.js](https://p5js.org/).
- Real-time data exchange between client and server is powered by WebSocket.
- I adopted entity interpolation to make other players' movements smoother.
- `SceneController` is responsible for switching between phases of the game, such as the loading screen, waiting room and main gameplay.
- I implemented an object-oriented UI framework to simply interface design in p5.js.

If you would like to run this:
- Build by running `tsc` in both the root directory and `public/`.
- Then run `npm start` to start the game server on port `3000`.
  You can change the port number by setting the `PORT` environment variable.
- Open `localhost:3000` on the web browser.

To be clear, this is not at all meant to compete with the actual Among Us game.
I do not own the ideas or assets I knocked off from Innersloth, including game sprites, maps and tasks.
