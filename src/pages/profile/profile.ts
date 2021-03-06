import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Item, Platform } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MyProfileViewPage } from '../my-profile-view/my-profile-view';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

	//Variables on Page:
	@ViewChild('fName') fName$;
	@ViewChild('lName') lName$;
	@ViewChild('lookingFor') lookingFor$;
	@ViewChild('dogName') dogName$;
	@ViewChild('snapDescription') snapDescription$;
	@ViewChild('likesDislikes') likesDislikes$;

	TEST: string;

	//variables for ProfilePage
	private itemDoc: AngularFirestoreDocument<Item>;
	item: Observable<Item>;			//Firebase Document
	uid: string;								//User id
	items: Observable<any[]>; 	//Collections
	
	fields: Item;
	private userName: string;	//Should be passed similar to uid
	private firstName: string;	//Fetched from Firebase document
	private lastName: string;	//Fetched from Firebase document
	private dogName: string;	//Fetched from Firebase document
	private lookingFor: string;
	private currLat: number;
	private currLong: number;
	private chats: Array<string>; //Placeholder for chats
	private snapDescription: string;
	private likesDislikes: string;
	private publicID: string;
	private openChats: Array<string>;

	private dogPhotoPath: string;	//Fetched from Firebase image
	private humanPhotoPath: string;	//Fetched from Firebase image

	//Guiding fields:
	private characterDescription: string;
	private ownerLikesAndDislikes: string;

	//Dog info
	dogs: Observable<any[]>; 	// Collection from firebase

	//Doc exists?
	private docExists: boolean;


	//Constructor, includes ctrls, etc..
  constructor(public navCtrl: NavController,private geolocation: Geolocation, public navParams: NavParams, public events: Events, public   afDB: AngularFireDatabase, private afs: AngularFirestore, private platform: Platform) {

	//this.events.subscribe('data:created', (data) => {	//Gets uid passed into from login page
		//console.log( data);
		
	//});//End subscribe event

	//This line binds items to the collection humanProfile
	//this.items = afs.collection('humanProfile').valueChanges();
	//console.log(this.items);

  }

	//this.item = this.itemDoc.valueChanges().pipe();
	//console.log(this.itemDoc.get);
	//console.log(this.item)
	
	//this.userDoc = fireStore.doc<any>('humanProfile/' + this.uid);	//Creates a document in database with their user ID
	/*this.userDoc.set({
    firstName: 'Allison',
	lastName: 'Little',
    email: '',
	dogID: '',
    // Other info you want to add here
  })*/
  //}

  ionViewDidLoad() {
		console.log('ionViewDidLoad ProfilePage');
		this.uid = localStorage.getItem("uid");
		this.chats = [];//LOSE THIS ONCE RESET ALL USER DOCS
		this.openChats = [];//DITTO
		this.currLat = 45.5;
		this.currLong = 122.7;

		//LOCATION:
		this.geolocation.getCurrentPosition().then((resp) => {
			this.currLat = resp.coords.latitude;
			this.currLong = resp.coords.longitude;
			console.log("Lat:  " + this.currLat);
			console.log("Long: " + this.currLong);
			}).catch((error) => {
				console.log('Error getting location: ', error);
			});
		
		//once the user id is found, we can see if the user's document exists
		//CHeck if document exists:
		//NEED TO SWITCH TO THIS STATEMENT ONLY
		this.afs.doc<Item>('humanProfile/'+this.uid).valueChanges().subscribe( res => {
			if(res){
				this.docExists = true;
				//TODO: what to do if they have a profile. display and hide edit buttons

				console.log("doc: humanProfile/" + this.uid + " found!");
				//This line binds a Document tothe user
				this.itemDoc = this.afs.doc<Item>('humanProfile/'+this.uid);
				this.itemDoc.valueChanges().forEach( data => { 
					this.firstName = data["firstName"],
					this.fName$ = this.firstName,
					this.lastName = data["lastName"],
					this.lName$ = this.lastName,
					this.dogName = data["dogName"],
					this.dogName$ = this.dogName,
					this.lookingFor = data["lookingFor"],
					this.lookingFor$ = this.lookingFor,
					this.snapDescription = data["snapDescription"],
					this.snapDescription$ = this.snapDescription,
					this.likesDislikes = data["likesDislikes"],
					this.likesDislikes$ = this.likesDislikes,
					this.publicID = data["publicID"],
					this.chats = data["chats"],
					this.openChats = data["openChats"]
					//this.currLat = data["currLat"],
					//this.currLong = data["currLong"]
				}); //Access by value
			}
			else{
				this.docExists = false;
				console.log("doc: humanProfile/" + this.uid + " not found");
				//TODO: HIDE SOME BUTTTONS, SHOW OTHER buttons and force user to create
			}

		});//End get doc
}

	//MUST BE CALLED TO INITIALLY CREATE USER PROFILE. ALSO CAN UPDATE ONCE PROFILE IS MADE
	updateInfo(){
			
		//This line will create a document in humanProfile collection with the ID
		this.afs.collection('humanProfile').doc(this.uid).set({
			firstName:  (this.fName$) ? this.fName$ : "UNKNOWN",
			lastName: (this.lName$) ? this.lName$ : "UNKNOWN",
			dogName: this.dogName$ ? this.dogName$ : "UNKNOWN",
			lookingFor: this.lookingFor$ ? this.lookingFor$ : "UNKNOWN",
			snapDescription: this.snapDescription$ ? this.snapDescription$ : "UNKNOWN",
			likesDislikes: this.likesDislikes$ ? this.likesDislikes$ : "UNKNOWN",
			UID: this.uid,
			publicID: this.makeid(10),
			chats: this.chats,
			openChats: this.openChats,
			currLat: this.currLat,
			currLong: this.currLong

		});

	}
	//Updating methods
	updateFirstName(){
		if(this.docExists){
			this.afs.collection('humanProfile').doc(this.uid).update({
				firstName: this.fName$
			})
			.then(function() {
				console.log('New First name: ' + this.fName$)
			})
			.catch(function(error) {
				// The document probably doesn't exist.
				console.error("Error updating document: ", error);
			});
		}
		else{//Need to create profile first
			alert("Must Update All info at once to create profile!" );
		}
	}

	updateLastName(){
		if(this.docExists){
			this.afs.collection('humanProfile').doc(this.uid).update({
				lastName: this.lName$
			})
			.then(function() {
				console.log('New Last name: ' + this.lName$)
			})
			.catch(function(error) {
				// The document probably doesn't exist.
				console.error("Error updating document: ", error);
			});
		}
		else{//Need to create profile first
			alert("Must Update All info at once to create profile!" );
		}
	}

	makeid(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
			 result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
 	}

	updateDogName(){
		if(this.docExists){
			this.afs.collection('humanProfile').doc(this.uid).update({
				dogName: this.dogName$
			})
			.then(function() {
				console.log('New dog name: ' + this.dogName$)
			})
			.catch(function(error) {
				// The document probably doesn't exist.
				console.error("Error updating document: ", error);
			});
		}
		else{//Need to create profile first
			alert("Must Update All info at once to create profile!" );
		}
	}

	updateLookingFor(){
		if(this.docExists){
			this.afs.collection('humanProfile').doc(this.uid).update({
				lookingFor: this.lookingFor$
			})
			.then(function() {
				console.log('New looking for: ' + this.lookingFor$)
			})
			.catch(function(error) {
				// The document probably doesn't exist.
				console.error("Error updating document: ", error);
			});
		}
		else{//Need to create profile first
			alert("Must Update All info at once to create profile!" );
		}
	}

	updateSnapDescription(){
		if(this.docExists){
			this.afs.collection('humanProfile').doc(this.uid).update({
				snapDescription: this.snapDescription$
			})
			.then(function() {
				console.log('New description: ' + this.snapDescription$)
			})
			.catch(function(error) {
				// The document probably doesn't exist.
				console.error("Error updating document: ", error);
			});
		}
		else{//Need to create profile first
			alert("Must Update All info at once to create profile!" );
		}
	}

	updateLikesDislikes(){
		if(this.docExists){
			this.afs.collection('humanProfile').doc(this.uid).update({
				likesDislikes: this.likesDislikes$
			})
			.then(function() {
				console.log('New likes/dislikes: ' + this.likesDislikes$)
			})
			.catch(function(error) {
				// The document probably doesn't exist.
				console.error("Error updating document: ", error);
			});
		}
		else{//Need to create profile first
			alert("Must Update All info at once to create profile!" );
		}
	}

	seeProfile(){
		this.navCtrl.push(MyProfileViewPage)
		.then(() => {
			this.events.publish('data:created', this.uid);
			console.log('Published', this.uid);
		})
		.catch( err =>
				console.log("Unable to view profile!", err)
		);
	}

}
