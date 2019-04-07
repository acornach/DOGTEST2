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

  async create(uid){
    //const { uid } = await this.auth.getUser(); // USE THIS METHOD EVENTUALLY
    console.log('TRYING TO CREATE');
    //creates a new chat document
    const data = {
      uid,
      createdAt: Date.now(),
      count: 0,//Number of messages in chat document??
      messages:[]//Messages
    };

    const docRef = await this.afs.collection('chats').add(data);//Create document in fireBase

    //They are using router, we are just going to pass back the Id of the chat room
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

}
