import { HttpClient } from '@angular/common/http';//TODO: THIS ISN"T WORKING!!!!
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from 'angularfire2/auth';//Maybe?
//ROUTER???
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import {Observable, combineLatest, of } from 'rxjs';


/*
  Generated class for the ChatServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()

export class ChatServiceProvider {

  constructor( private afs: AngularFirestore) {
    console.log('Hello ChatServiceProvider Provider');
  }

  get(chatId){
    return this.afs
    .collection<any>('chats')
    .doc(chatId)
    .snapshotChanges()
    .pipe(
      map(doc => {
        return { id: doc.payload.id, ...doc.payload.data() };//the ... will copy all data in, overwrite only the other specified values
      })
    );
  }

  async create(uid1, uid2){
    //const { uid } = await this.auth.getUser(); // USE THIS METHOD EVENTUALLY
    console.log('TRYING TO CREATE');
    //creates a new chat document
    const data = {
      uid1,
      uid2,
      createdAt: Date.now(),
      count: 0,//Number of messages in chat document??
      messages:[]//Messages
    };

    const docRef = await this.afs.collection('chats').add(data);//Create document in fireBase

    //We just pass back the Id of the chat room
    //The other page might have to use the NavCtrl or we should maybe do it here
    console.log("ID: " + docRef.id.toString());
    return docRef.id.toString();
  }

  async sendMessage(uid, chatId, content){
    //const { uid } = await this.auth.getUser(); // USE THIS METHOD EVENTUALLY
    const data = {
      uid,
      content,
      createdAt: Date.now()
    };

    if(uid){
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({//Adds a new message to the document
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  //TODO: Learn to understand this
  //It might fix our uid1, uid2 Issue someday
  joinUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};
    console.log("chat$: ");console.log(chat$);
    //if(chat$){
      return chat$.pipe(
        switchMap(c => {
          // Unique User IDs
          chat = c;
          const uids = Array.from(new Set(c.messages.map(v => v.uid)));
          //console.log("uids: ");console.log(uids);
          
          // Firestore User Doc Reads
          const userDocs = uids.map(u =>
            this.afs.doc('users/${u}').valueChanges()
          );
          //onsole.log("user docs:");console.log(userDocs);
          return userDocs.length ? combineLatest(userDocs) : of([]);
        }),
        map(arr => {
          //console.log("arr:");console.log(arr);
          arr.forEach(v => (joinKeys[(<any>v).uid] = v));
          chat.messages = chat.messages.map(v => {
            return { ...v, user: joinKeys[v.uid] };
          });
    
          return chat;
        })
      );
    //}
  }
}
