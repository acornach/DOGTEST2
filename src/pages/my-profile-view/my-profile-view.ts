import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

/**
 * Generated class for the MyProfileViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-profile-view',
  templateUrl: 'my-profile-view.html',
})

export class MyProfileViewPage {
  uid: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
  //  this.events.subscribe('data:created', (data) => {	//Gets uid passed into from login page
  //    console.log( data);
  //    this.uid = data;
  //  })
  }

  ionViewDidLoad() {
    this.uid = localStorage.getItem("uid");
    console.log('ionViewDidLoad MyProfileViewPage');
  }

}