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
  chatLoaded: number;
  chatId: string;//Each chat between you and a pal will recieve an ID that needs to be stored somewhere
  toId: string;	
  newMsg: string;
  chat$: Observable<any>;
  buddyArray = Array<string>();
  hasChat: boolean = true;//Assume they have a chat already, This is part of the hacky chat fix
  private itemDoc: AngularFirestoreDocument<Item>;
  private itemCollection: Observable<{}[]>;
  //Usernames for to/from
  toUname: string;
  fromUname: string;
  
  	//Constructor, includes ctrls, etc..
    constructor(private auth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams, public events: Events, public   afDB: AngularFireDatabase, private afs: AngularFirestore, private platform: Platform, public cs: ChatServiceProvider) {
      
      this.events.subscribe('data:created', (data, pal) => {	//TODO: GET UID from AUTH
        console.log("Data Created!!"); console.log( data, pal);
        //Gets both the user ID and the Pal to message ID from chats.ts
        this.uid = data;
        this.palid = pal;
        this.chatLoaded = 0;//Set that no chat has been loaded
        var oldChat: string;//will store ID of old chat if one is found?
  
        this.checkForChat(oldChat);//once data is created, call the check for old chat function
  
      });//end SUBSCRIBE
    }//end constructor

  async updatePage(){
    console.log("UPDATEPAGE!!!!!!!!");

  }

  async checkForChat(oldChat){
    if(this.uid){//Don't try anything if there is no userId defined
      new Promise(ref => {
        //Each humanProfile has an array of chats. The array stores the uid of people they have chatted with
        this.afs.collection('humanProfile').doc(this.uid).valueChanges().subscribe( res => {
        this.buddyArray = res["chats"];
        
        //If has no chats at all yet, start a new one
        if(this.buddyArray.length == 0)
          return this.createChat();

        //For each friend in your buddy array see if you have an active chat already
        for(var buddy of this.buddyArray){
          //console.log("BUDDY:",buddy);
          
          if(buddy != "")
            //This will look in the chats collection. Chats will store the uid of both parties and an array of messages
            var BUD = this.afs.collection('chats').doc(buddy).valueChanges().subscribe( bud =>{
              var uid1 = bud['uid1'];
              var uid2 = bud['uid2'];

              //If either uid is equal to the palid, then
              if((this.palid == uid1 && this.uid == uid2) || (this.uid == uid1 && this.palid == uid2)){
                console.log("TRUE!");
                this.hasChat = true;
                oldChat = buddy;
                this.chatId = oldChat;
                if(this.chatLoaded < 1)
                  return this.grabChat();
              }
              else{
                //this.hasChat = false; //Assign hasChat to false if no chat is found
              }
            });
        
          }
          if(this.hasChat == false) { //has chat can only be set to false by the inner if statement above
            console.log("FALSE!");
            this.hasChat = true;
            //if(this.chatLoaded < 1) //Don't try to create a chat if one has already been made
              return this.createChat();
          }
        })
      });//end promise
  }


  }
  createChat(){
    this.chatLoaded = 1;
    this.hasChat = true;
    //IF NO CHAT EXISTS, create one between both members
    this.cs.create(this.uid, this.palid).then(value => {
      this.chatId = value.toString(); console.log("this.chatId: " + this.chatId);
      const source = this.cs.get(this.chatId); console.log(source);
      this.chat$ = source;

      //MAYBE add value to other user as well
      this.afs.collection('humanProfile').doc(this.uid).update({
        chats: firestore.FieldValue.arrayUnion(this.chatId)
      });
    });
  }

  grabChat(){
    //IF FOUND A CHAT
    this.chatLoaded = 1;
    const source = this.cs.get(this.chatId); console.log(source);
    this.chat$ = source;
    this.afs.collection('humanProfile').doc(this.uid).update({
      chats: firestore.FieldValue.arrayUnion(this.chatId)
    });
  }

  //On Init, get the uid from the event and create the new chat document
  ngOnInit() {
    //get uid
    //IDEA: MAKE BUDDY AREA GLOBAL ON LOAD OF PROGRAM

   
  }//end on init

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
