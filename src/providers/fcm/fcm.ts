import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx'
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from 'ionic-angular';
import { FirebaseAuth } from 'angularfire2';
/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {

  constructor(public http: HttpClient, public firebaseNative: Firebase, public afs: AngularFirestore, private platform: Platform, private fireAuth: FirebaseAuth) {
    console.log('Hello FcmProvider Provider');
  }

  //TOKEN is essentially permission from user to send notifications to the device (phone, tablet, etc.)
  async getToken(){
    let token;
    if(this.platform.is('android')){

      token = await this.firebaseNative.getToken()
    }
    else if(this.platform.is('ios')){
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }

    //Web app or other?
    else{
      token = await this.firebaseNative.getToken();
    }

    //Once you get token:
    return this.saveTokenToFirestore(token);//Token is a big long string
  }

  //Works with getToken. This function will create a document in Firebase to work with the current user and devices
  private saveTokenToFirestore(token){
    if(!token) return;

    const devicesRef = this.afs.collection('devices');

    //Get firebaseAuth UID

    const docData = {
      token,
      userId: this.fireAuth.currentUser//Not sure if correct???
    }
    console.log("CURRENT USER FROM FIREBASE AUTH: ", this.fireAuth.currentUser);

    //Creates a document with token as the document id in the collection 'devices'
    //Insures every device in Firestore will have a unique ID
    return devicesRef.doc(token).set(docData);
  }

  //Returns an observable on the front end (for native apps only, need different method for web apps which might be applicable to this???)
  listenToNotifications(){
    return this.firebaseNative.onNotificationOpen()
    //this.firebaseNative.
  }
}

/*MOVE TO PROVIDER
    //Firebase Cloud Messaging (FCM) FUNCTIONS
     //receiving FCMID
     fcm.getToken().then((token) => {
      localStorage.setItem("token", token);
    },(err) =>{
      alert(JSON.stringify(err));
      console.log("ERROR: ",err);
    })
    //received notification
    fcm.onNotification().subscribe((data) => {
      if(data.wasTapped){
        
      }
      else{
        alert(data.message);
        console.log(data.message);
      }
    })

    //updating token
    fcm.onTokenRefresh().subscribe((token) =>{
      localStorage.setItem("token", token);
    })*/