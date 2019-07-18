import * as functions from 'firebase-functions';//imports the firebase-functions module and makes available as functions
import * as admin from 'firebase-admin';

//Remember these are our server functions for our firebase, not the Client side code!!
admin.initializeApp(functions.config().firebase)

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
 export const helloWorld = functions.https.onRequest((request, response) => {
    console.log("ADAM's Console message");
    response.send("Hello from Firebase!");
 });


 //exporting a notification when a new document gets created in the subscribers collection
 exports.newSubscriberNotification = functions.firestore
    .document('messages/{messageId}')
    .onCreate( async event => {
        const data = event.data();//gets data from document and saves the userId and the subscriberId
        console.log("Data: " + data);
    
        //Only attempt to message if there is data returned from document
        if(data){
            const userId = data.userId;
            const sender = data.subscriber;
            const message = data.body
            
            //Log to firebase console for debugging
            console.log("uid: " + userId);
            console.log("subscriber: " + sender);
            console.log("body: " + message)

            //Creates the notification payload. The notification has a sender and a message
            const payload = {
                notification: {
                    title: sender,
                    body: message
                }
            }

            // Find all the devices you want to notify
            const db = admin.firestore()
            const devicesRef = db.collection('devices').where('userId', '==', userId) //Find all the devices that this user has registered
            const devices = await devicesRef.get();//Retrieve the devices data by calling get

            //set up empty array for each token
            var tokens = ""

            //loop over each document witht the user id and fill the tokens array
            devices.forEach(result =>{
                const token = result.data().token;
                tokens = token;

                //Should only be 1 token right now!!
                console.log("TOKEN: " + token);
            })

            //Log Payload for debugging:
            console.log("Payload: " + payload.notification.title + " | " + payload.notification.body);

            //Send the notification to device
            return admin.messaging().sendToDevice(tokens, payload); //send our message to the device

        }//end if
        else{
            return "";
        }

    });

