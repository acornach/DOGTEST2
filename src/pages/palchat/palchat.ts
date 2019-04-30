import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Item, Platform } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AddpalchatroomPage } from '../addpalchatroom/addpalchatroom';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the PalchatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 * 
 * THIS PAGE SHOULD ALREADY KNOW WHO YOUR FRIEND IS
 * START MESSAGE IMPLEMENTATION HERE
 */

@IonicPage()
@Component({
  selector: 'page-palchat',
  templateUrl: 'palchat.html',
  //ADD CSS HERE TO ALL PAGES
})
export class PalchatPage implements OnInit {

  //UID's for to/from are on document names only
  uid: string;
  palid: string;
  chatId: string;//Each chat between you and a pal will recieve an ID that needs to be stored somewhere
  toId: string;	
  newMsg: string;
  chat$: Observable<any>;

  //Usernames for to/from
  toUname: string;
  fromUname: string;
  
  	//Constructor, includes ctrls, etc..
    constructor(private auth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams, public events: Events, public   afDB: AngularFireDatabase, private afs: AngularFirestore, private platform: Platform, public cs: ChatServiceProvider) {
    }//end constructor

  //On Init, get the uid from the event and create the new chat document
  ngOnInit() {
    //get uid
    this.events.subscribe('data:created', (data, pal) => {	//TODO: GET UID from AUTH
      console.log("Data Created!!"); console.log( data, pal);
      this.uid = data;
      this.palid = pal;

      //TODO: Check to see if Document exists first
      this.cs.create(this.uid, this.palid).then(value => {
        this.chatId = value.toString(); console.log("this.chatId: " + this.chatId);
        const source = this.cs.get(this.chatId); console.log(source);
        this.chat$ = source;//this.cs.joinUsers(source); console.log(this.chat$);
        //console.log('New chat ID: ' + this.chatId);
      });//TODO: how to get chatId from create properly
    });
  }

  //URGENT NEXT: FIGURE OUT WHERE IS CHATID
  submit(chatId) {
    console.log("uid" + this.uid + "\nchatID " + this.chatId + "\n" + this.newMsg);
    this.cs.sendMessage(this.uid, chatId, this.newMsg);
    this.newMsg = '';//reset new message
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }
  //Constructor to navigate to add-room page
  addRoom(){
    this.navCtrl.push(AddpalchatroomPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PalchatPage');
  
  }

}
