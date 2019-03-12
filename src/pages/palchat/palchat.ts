import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Item, Platform } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AddpalchatroomPage } from '../addpalchatroom/addpalchatroom';

/**
 * Generated class for the PalchatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-palchat',
  templateUrl: 'palchat.html',
})
export class PalchatPage {

  //UID's for to/from are on document names only
  uid: string;
  toId: string;	
  rooms = [];

  //Usernames for to/from
  toUname: string;
  fromUname: string;
  

  	//Constructor, includes ctrls, etc..
    constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public   afDB: AngularFireDatabase, private afs: AngularFirestore, private platform: Platform) {

      this.events.subscribe('data:created', (data) => {	//Gets uid passed into from login page
        //console.log( data);
        this.uid = data;

      });
  }

  //Constructor to navigate to add-room page
  addRoom(){
    this.navCtrl.push(AddpalchatroomPage);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PalchatPage');
  }

}
