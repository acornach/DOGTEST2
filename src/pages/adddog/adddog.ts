import { Component, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, Item, Platform, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

/**
 * Generated class for the AdddogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adddog',
  templateUrl: 'adddog.html',
})
export class AdddogPage {
  @ViewChild('dogName') dogName$;
  @ViewChild('playStyle') playStyle$;
  @ViewChildren('intensity') intensity$;
  @ViewChild('social') social$;
  uid: string;
  //TODO:
  //Display Dogs in a row, you can create an Update button to another page 
  //and pass both dog ID and Human ID
  did: string;
  playStyle: number;
  intensity: number;
  social: number;




  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public   afDB: AngularFireDatabase, private afs: AngularFirestore, private platform: Platform) {
	
	//this.events.subscribe('data:created', (data) => {	//Gets uid passed into from login page
	//	console.log( data);
	//	this.uid = data;
	//});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdddogPage');
    this.uid = localStorage.getItem("uid");
  }

  addDogName(){
    //This line will create a document in humanProfile collection with the ID
    //this.afs.collection('humanProfile').doc(this.uid).collection("dogs").doc(this.afs.createId()).set({
    this.afs.collection('dogs').doc(this.afs.createId()).set({
      firstName: this.dogName$ ? this.dogName$ : "Fido", //Fido is default dog name
      humanID: this.uid,
      playStyle: this.playStyle ? this.playStyle : 0,//0 is default for dog data
      intensity: this.intensity ? this.intensity : 0,
      social: this.social ? this.social : 0

		});

  }

  upDateDogName(){
    //This line will create a document in humanProfile collection with the ID
    this.afs.collection('humanProfile').doc(this.uid).collection("dogs").doc(this.afs.createId()).set({
      firstName: this.dogName$,
      humanID: this.uid
		});

  }

  //WHILE CREATING ALGORITHM, TIE TO HUMAN LATER
  tempAddDogName(){
    this.afs.collection('dogProfile').doc(this.afs.createId()).set({
      name: this.dogName$,
      parent: this.uid,
      fixed: true,
      intense: true,
      playStyle: "contact",
      social: true
		});
  }

}
