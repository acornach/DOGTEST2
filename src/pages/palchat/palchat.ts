import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Item, Platform } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AddpalchatroomPage } from '../addpalchatroom/addpalchatroom';
import { AngularFireAuth } from 'angularfire2/auth';
import { firestore } from 'firebase/app';
import { controlNameBinding } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import { updateDate } from 'ionic-angular/umd/util/datetime-util';
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
  buddyArray = Array<string>();
  hasChat: boolean;
  private itemDoc: AngularFirestoreDocument<Item>;
  private itemCollection: Observable<{}[]>;
  //Usernames for to/from
  toUname: string;
  fromUname: string;
  
  	//Constructor, includes ctrls, etc..
    constructor(private auth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams, public events: Events, public   afDB: AngularFireDatabase, private afs: AngularFirestore, private platform: Platform, public cs: ChatServiceProvider) {
    }//end constructor

  async updatePage(){
    console.log("UPDATEPAGE!!!!!!!!");

  }

  createChat(){
    //IF NO CHAT EXISTS:
    this.cs.create(this.uid, this.palid).then(value => {
      this.chatId = value.toString(); console.log("this.chatId: " + this.chatId);
      const source = this.cs.get(this.chatId); console.log(source);
      this.chat$ = source;
      this.afs.collection('humanProfile').doc(this.uid).update({
        chats: firestore.FieldValue.arrayUnion(this.chatId)
      });
});
  }
  //On Init, get the uid from the event and create the new chat document
  ngOnInit() {
    //get uid
    this.events.subscribe('data:created', (data, pal) => {	//TODO: GET UID from AUTH
      console.log("Data Created!!"); console.log( data, pal);
      this.uid = data;
      this.palid = pal;
      this.hasChat = false;
      var oldChat: string;

      //IDEA: MAKE BUDDY AREA GLOBAL ON LOAD OF PROGRAM
      const ref = this.afs.collection('humanProfile').doc(this.uid).valueChanges().subscribe( res => {
        this.buddyArray = res["chats"];
        var hasChat = false;
        for(var buddy of this.buddyArray){
          console.log("BUDDY:",buddy);
          
          if(buddy != "")
          var BUD = this.afs.collection('chats').doc(buddy).valueChanges().subscribe( bud =>{
            var uid1 = bud['uid1'];
            var uid2 = bud['uid2'];
            if(this.palid == uid1 || this.palid == uid2){
              console.log("TRUE!");
              this.hasChat = true;
              oldChat = buddy;
            }
          });//end subscribe
          
        }
        
      });

      if(this.hasChat){
        console.log("CHAT FOUND!", oldChat);
      }
      else{
        //this.createChat();
        console.log("CREATING CHAT!");
      }

    }); //end SUBSCRIBE
  }//end CONSTRUCTOR

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
