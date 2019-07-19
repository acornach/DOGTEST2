import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, Item, Events} from 'ionic-angular';

import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { TestdatabasePage } from '../testdatabase/testdatabase';
import { StartupPage } from '../startup/startup';
import { AdddogPage } from '../adddog/adddog';
import { ProfilePage } from '../profile/profile';
import { SearchingPage } from '../searching/searching';
import { PalsPage } from '../pals/pals';
import { SettingsPage } from '../settings/settings';
import { DogsPage } from '../dogs/dogs'
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Geolocation } from '@ionic-native/geolocation';
import { tap } from 'rxjs/operators';
import { ToastController } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

//  @ViewChild('username') uname;
//  @ViewChild('password') password;
	uid: string;	//User's ID to grab/write data from database
	lat: number;
	long: number;
	
  constructor(
	  	public navCtrl: NavController, 
		public alertCtrl: AlertController, 
		public events: Events, 
		public afDB: AngularFireDatabase, 
		private afs: AngularFirestore,
		private geolocation: Geolocation, 
		public toastCtrl: ToastController,
		public fcm: FCM,
		public platform: Platform
		//public fcm: FcmProvider
		) {
	
//	this.events.subscribe('data:created', (data) => {	//Gets uid passed into from login page
//		console.log( data);
//		this.uid = data;

		
	//});//end events
}

  searching(){
  	this.navCtrl.push(SearchingPage)
	//	.then(() => {
	//				this.events.publish('data:created', this.uid);
	//				console.log('Published', this.uid);
	//	});
  }
  
  yourPals(){
  	this.navCtrl.push(PalsPage)
	//	.then(() => {
	//				this.events.publish('data:created', this.uid);
	//				console.log('Published', this.uid);
	//	});
  }
  
  settings(){
  	this.navCtrl.push(SettingsPage)
	//	.then(() => {
	//				this.events.publish('data:created', this.uid);
	//				console.log('Published', this.uid);
	//	});
  }
  
  yourProfile(){
  	this.navCtrl.push(ProfilePage)
	//	.then(() => {
	//				this.events.publish('data:created', this.uid);
	//				console.log('Published', this.uid);
	//	});
  }
  
  addDog(){
  	this.navCtrl.push(AdddogPage)
	//	.then(() => {
	//				this.events.publish('data:created', this.uid);
	//				console.log('Published', this.uid);
	//	});
  }

	dogs(){
		this.navCtrl.push(DogsPage)
	//	.then(() => {
	//				this.events.publish('data:created', this.uid);
	//				console.log('DOGS!!!', this.uid);
	//	});
	}
	
	ionViewDidLoad(){
		this.uid = localStorage.getItem("uid");//Stores user ID to Local Storage for other pages
		
		this.geolocation.getCurrentPosition().then((resp) => {
			this.lat = resp.coords.latitude;
			this.long = resp.coords.longitude;
			console.log("Lat:  " + this.lat);
			console.log("Long: " + this.long);
			}).catch((error) => {
			console.log('Error getting location', error);
			});

		this.afs.doc<Item>('humanProfile/'+this.uid).valueChanges().subscribe( res => {
			
			if(res){
			
				if(this.lat != undefined && this.long != undefined){
					//TODO: If they have profile, update their Lat/Long
					console.log("doc: humanProfile/" + this.uid + " found!");
					this.afs.collection('humanProfile').doc(this.uid).update({
						currLat: this.lat,
						currLong:  this.long
					})
					.then(function() {
						console.log('New lat/long: ' + this.long)
					})
					.catch(function(error) {
						// The document probably doesn't exist.
						console.error("Error updating document: ", error);
					});
				}//End inner if
				else{
					console.log("Undefined lat/long, reassigning");
					this.geolocation.getCurrentPosition().then((resp) => {
						this.lat = resp.coords.latitude;
						this.long = resp.coords.longitude;
						console.log("Lat:  " + this.lat);
						console.log("Long: " + this.long);
					 }).catch((error) => {
						 console.log('Error getting location', error);
					 });
				}
				//Access by value
			}
			else{

				console.log("doc: humanProfile/" + this.uid + " not found");
				//SHOW buttons and force data fill
			}
	

		});//end afs.doc


		//TODO: After testing, put these back!!!
		if(this.platform.is('android')){
		this.getToken();//receiving FCMid
	  
		this.subscribeNotifications();//subScribe to notifications

//		this.fcm.subscribeToTopic('messages').then(succ => {
//			alert("Subscribed! " + succ)
//		}).catch(err => {
//			alert("Unable to subScribe: " + err)
//		});

		this.updateToken();	//subscribe to token updates

		//this.sendMessage("Hello", "world2");	//Test for sending messages and using firebase functions
		}
	}

	sendMessage(title, body){
		
		this.afs.collection('messages').doc(this.uid).set({
			title: title, 
			body: body,
			userId: this.uid,
			subscriber: "Adam!"
		});
		
	}

	getToken(){
		 this.fcm.getToken().then(token =>{
			localStorage.setItem("token", token);
			alert("TOKEN: " + localStorage.getItem("token"));
			//This line will create a document in humanProfile collection with the ID
			this.afs.collection('devices').doc(localStorage.getItem("token")).set({
				token: localStorage.getItem("token"),
				userId: this.uid
			});
		
		  })
		  .catch(err =>{
			console.log("ERROR getting tolken in app component ", err);
			alert("ERROR getting tolken in app component " + err);
			//alert("ERROR getting tolken in app component " + stringify(err));
		  })
	}

	subscribeNotifications(){
		alert("NOTIFICATION")
		this.fcm.onNotification().subscribe(data => {
			if(data.wasTapped){
			  alert("TAPPED!");//DO SOMETHING IF NOTIFICATION IS TAPPED!!!
			}
			else{
				//Message alerts come with a sender and a
			  alert("New Message From: " + data.title + "\n" + data.body);//must use key/Value to get message
			}
		  })
	}

	updateToken(){
		 this.fcm.onTokenRefresh().subscribe(token => {
			localStorage.setItem("token", token);
		  })
	}
}
