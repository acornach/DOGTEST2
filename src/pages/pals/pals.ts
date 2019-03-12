import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PalchatPage } from '../palchat/palchat';

/**
 * Generated class for the PalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pals',
  templateUrl: 'pals.html',
})
export class PalsPage {
  uid: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, private geolocation: Geolocation ) {
	
	this.events.subscribe('data:created', (data) => {	//Gets uid passed into from login page
		console.log( data);
		this.uid = data;
  });
  
  this.geolocation.getCurrentPosition().then((resp) => {
      console.log("Lat:  " + resp.coords.latitude);
      console.log("Long: " + resp.coords.longitude);
     }).catch((error) => {
       console.log('Error getting location', error);
     });

  

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PalsPage');
  }

  palchat(){
    this.navCtrl.push(PalchatPage);
  }

}
