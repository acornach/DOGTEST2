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
import { firestore } from 'firebase/app';


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
	hasProfile: boolean;
	
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
		) 
	{}

  searching(){
  	this.navCtrl.push(SearchingPage)
  }
  
  yourPals(){
  	this.navCtrl.push(PalsPage)
  }
  
  settings(){
  	this.navCtrl.push(SettingsPage)
  }
  
  yourProfile(){
  	this.navCtrl.push(ProfilePage)
  }
  
  addDog(){
  	this.navCtrl.push(AdddogPage)
  }

	dogs(){
		this.navCtrl.push(DogsPage)
	}
	
	ionViewWillEnter(){
		this.hasProfile = true; //(localStorage.getItem("hasProfile") == "true") ? true : false; 
	}

	ionViewDidEnter(){
		localStorage.setItem("hasProfile", "true");
		this.hasProfile = true; //Initialize profile to false until found in database
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
					
					this.hasProfile = true;
					localStorage.setItem("hasProfile", "true");

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
				this.hasProfile = false;
				localStorage.setItem("hasProfile", "false");
			}
		});//end afs.doc

		//Don't get device tolkens if you are a PC
		if(this.platform.is('android')){
			this.getToken();//receiving FCMid
		
			this.subscribeNotifications();//subScribe to notifications

			this.updateToken();	//subscribe to token updates
		}
	}

	//OLD: SET FOR DELETE
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
		  })
	}

	subscribeNotifications(){
		alert("NOTIFICATION")
		this.fcm.onNotification().subscribe(data => {
			if(data.title == "NEW MESSAGE"){
				/**
				 * When a user who you have not "palled" with wants
				 * to message you, they start a chat. You get a notification
				 * here, but for now all this does is add the chat to your
				 * personal chats array and adds the user to your openChats array.
				 * 
				 * This way the other user does not write to your database file, your
				 * app does. In the future this will probably need to be changed somehow
				 * 
				 * For now this allows chats to be created by other user and you will then
				 * join in on the same chat with them.
				 */

				var messageBody: string;
				messageBody = data.body;
				var sender = messageBody.substring(0,messageBody.indexOf(':|:'));
				var chat = messageBody.substring(messageBody.indexOf(':|:') + 3);
				
				const ref = this.afs.collection('humanProfile').doc(this.uid);
      			ref.update({//Adds a new message to the document
					chats: firestore.FieldValue.arrayUnion(chat),
					openChats: firestore.FieldValue.arrayUnion(sender)
      			});
			}
			else{
				if(data.wasTapped){
					alert("TAPPED!");//DO SOMETHING IF NOTIFICATION IS TAPPED!!!
				}
				else{
					//TODO: HANDLE ALERTS SO IF YOU ARE IN A DIFFERENT SPOT THEY DON"T SHOW UP!
					//Message alerts come with a sender and a
					alert("New Message From: " + data.title + "\n" + data.body);//must use key/Value to get message
				}
			}
		  })
	}

	updateToken(){
		 this.fcm.onTokenRefresh().subscribe(token => {
			localStorage.setItem("token", token);
		  })
	}
}
