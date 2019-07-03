import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
/**
 * Generated class for the PalProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pal-profile',
  templateUrl: 'pal-profile.html',
})
export class PalProfilePage {

  uid: string;
  palid: string;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams) {
    this.events.subscribe('data:created', (data, pal) => {	//TODO: GET UID from AUTH
      console.log("Data Created!!"); console.log( data, pal);
      //Gets both the user ID and the Pal to message ID from chats.ts
      this.uid = data;
      this.palid = pal;
    })
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PalProfilePage');
  }

}
