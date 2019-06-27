import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PalchatPage } from '../palchat/palchat';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

/**
 * Generated class for the DogsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dogs',
  templateUrl: 'dogs.html',
})
export class DogsPage {
  uid: string;

  allDogs: Array<string>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, private geolocation: Geolocation,private afs: AngularFirestore ) {
    this.events.subscribe('data:created', (data) => {	//Gets uid passed into from login page
      console.log( data);
      this.uid = data;
      
      afs.collection('dogProfile').valueChanges().forEach(res => {
        res.forEach(dog => {
          this.allDogs.push(dog['name']);
        })
      });
  
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DogsPage');
  }

}
