import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { FCM } from '@ionic-native/fcm';

//Importing firebase for db
import * as firebase from 'firebase'

import { StartupPage } from '../pages/startup/startup';

// Initialize Firebase
var config = {
	apiKey: "AIzaSyB5CXbl5EfLlxcNHkh0rrVoalEuFq9jt9U",
	authDomain: "firetest1-ccc03.firebaseapp.com",
	databaseURL: "https://firetest1-ccc03.firebaseio.com",
	projectId: "firetest1-ccc03",
	storageBucket: "firetest1-ccc03.appspot.com",
	messagingSenderId: "551343712590"
};


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = StartupPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, geolocation: Geolocation, fcm: FCM) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

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
    })


    });
	firebase.initializeApp(config);
  }
}

