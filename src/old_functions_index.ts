// import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";

// const serviceAccount = require("../admin-credential.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://crappy-among-us.firebaseio.com/"
// });

// exports.joinGame = functions.https.onCall(async (data, context) => {
//     if (!context.auth) {
//         throw new functions.https.HttpsError("failed-precondition", "The user is not signed in.");
//     }

//     const gameID = data.gameID;
//     console.log(gameID);
//     if (gameID === undefined || !/^[\-_0-9A-Za-z]{20}$/.test(gameID)) {
//         throw new functions.https.HttpsError("invalid-argument", "Invalid game ID.");
//     }
    
//     const gameRef = admin.database().ref(`games/${gameID}`);
//     const snapshot = await gameRef.once("value");
//     if (!snapshot.exists()) {
//         throw new functions.https.HttpsError("not-found", "Game not found.");
//     }

//     await gameRef.child(`players/${context.auth.uid}`).set({
//         posX: 0,
//         posY: 0
//     });
// });
