import { Component, ViewChild } from '@angular/core';
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
  uid: string;
  //TODO:
  //Display Dogs in a row, you can create an Update button to another page 
  //and pass both dog ID and Human ID
  did: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public   afDB: AngularFireDatabase, private afs: AngularFirestore, private platform: Platform) {
	
	this.events.subscribe('data:created', (data) => {	//Gets uid passed into from login page
		console.log( data);
		this.uid = data;
	});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdddogPage');
  }

  addDogName(){
    //This line will create a document in humanProfile collection with the ID
    this.afs.collection('humanProfile').doc(this.uid).collection("dogs").doc(this.afs.createId()).set({
      firstName: this.dogName$,
      humanID: this.uid
		});

  }

  upDateDogName(){
    //This line will create a document in humanProfile collection with the ID
    this.afs.collection('humanProfile').doc(this.uid).collection("dogs").doc(this.afs.createId()).set({
      firstName: this.dogName$,
      humanID: this.uid
		});

  }

}
