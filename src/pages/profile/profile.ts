import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Item, Platform } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

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
	private snapDescription: string;
	private likesDislikes: string;

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public   afDB: AngularFireDatabase, private afs: AngularFirestore, private platform: Platform) {

	this.events.subscribe('data:created', (data) => {	//Gets uid passed into from login page
		//console.log( data);
		this.uid = data;

		//once the user id is found, we can see if the user's document exists
		//CHeck if document exists:
		//NEED TO SWITCH TO THIS STATEMENT ONLY
		afs.doc<Item>('humanProfile/'+this.uid).valueChanges().subscribe( res => {
			if(res){
				this.docExists = true;
				//TODO: what to do if they have a profile. display and hide edit buttons

				console.log("doc: humanProfile/" + this.uid + " found!");
				//This line binds a Document tothe user
				this.itemDoc = afs.doc<Item>('humanProfile/'+this.uid);
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
					this.likesDislikes$ = this.likesDislikes
				}); //Access by value
			}
			else{
				this.docExists = false;
				console.log("doc: humanProfile/" + this.uid + " not found");
				//SHOW buttons and force data fill
			}

		});//End get doc
	});//End subscribe event

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
}

//Updating methods
	updateFirstName(){
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

	updateLastName(){
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

	updateInfo(){
		
		//This line will create a document in humanProfile collection with the ID
		this.afs.collection('humanProfile').doc(this.uid).set({
			firstName: this.fName$,
			lastName: this.lName$,
			dogName: this.dogName$,
			lookingFor: this.lookingFor$,
			snapDescription: this.snapDescription$,
			likesDislikes: this.likesDislikes$,
			UID: this.uid
		});

	}

	updateDogName(){
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

	updateLookingFor(){
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

	updateSnapDescription(){
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

	updateLikesDislikes(){
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
}
