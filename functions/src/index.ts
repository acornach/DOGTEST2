import * as functions from 'firebase-functions';//imports the firebase-functions module and makes available as functions

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
 export const helloWorld = functions.https.onRequest((request, response) => {
    console.log("ADAM's Console message");
    response.send("Hello from Firebase!");
 });
