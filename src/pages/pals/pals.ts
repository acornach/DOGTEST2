import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PalchatPage } from '../palchat/palchat';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { PalProfilePage } from '../pal-profile/pal-profile';

/**
 * Generated class for the PalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 /**
  * This page will display anyone you have talked to or want to talk to?
  * Searching will help you find new pals to talk to
  */

@IonicPage()
@Component({
  selector: 'page-pals',
  templateUrl: 'pals.html',
})
export class PalsPage {
  uid: string;

  myPals: Array<string>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, private geolocation: Geolocation,private afs: AngularFirestore ) {
	
    this.events.subscribe('data:created', (data) => {	//Gets uid passed into from login page
      console.log( data);
      this.uid = data;
      afs.doc<Item>('humanProfile/'+this.uid).valueChanges().subscribe( res => {
        if(res){
          //TODO: pull array data from firebase
          this.myPals = res["friendList"];
          console.log("myPals-------------");console.log(this.myPals);

        }
      });
    });
      
    this.geolocation.getCurrentPosition().then((resp) => {
        console.log("Lat:  " + resp.coords.latitude);
        console.log("Long: " + resp.coords.longitude);
    }).catch((error) => {
        console.log('Error getting location', error);
    });

  }//end constructor

  ionViewDidLoad() {
    console.log('ionViewDidLoad PalsPage');
  }

  palchat(){
    this.navCtrl.push(PalchatPage)
    .then(() => {
      this.events.publish('data:created', this.uid);
      console.log('Published', this.uid);
    });
  }

  chatPal(pal){
    this.navCtrl.push(PalchatPage)
    .then(() => {
      this.events.publish('data:created', this.uid, pal);
     // this.events.publish('pal:created', pal);
      console.log('Published', this.uid, pal);
    })
    .catch(err => {
      console.log("Error: ", err);
    })
  }

  palProfile(pal){
    this.navCtrl.push(PalProfilePage)
    .then(() => {
      this.events.publish('data:created', this.uid, pal);
      console.log('published', this.uid, pal)
    })
    .catch(err => {
      console.log("Error: ", err);
    })
  }

}
