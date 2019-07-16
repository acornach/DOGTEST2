
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController,AlertController, NavParams, Item, Platform } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the SearchingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-searching',
  templateUrl: 'searching.html',
})
export class SearchingPage {

  uid: string;
  uLat: number;
  uLong: number;
  oLat: number;
  oLong: number;

  possiblePals: Array<any>;
  possiblePalID: Array<string>;

  
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public events: Events, public   afDB: AngularFireDatabase, private afs: AngularFirestore,private geolocation: Geolocation) {
    //const milesPerLatLong = 69;
    
	//this.events.subscribe('data:created', (data) => {	//Gets uid passed into from login page
  //	console.log( data);
   

    
     
 // });
  


  
  }
  
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchingPage');
    this.uid = localStorage.getItem("uid");
    this.possiblePals = [];
    this.possiblePalID = [];
    
    this.geolocation.getCurrentPosition().then((resp) => {
			this.uLat = resp.coords.latitude;
			this.uLong = resp.coords.longitude;
      console.log("Lat:  " + this.uLat);
      console.log("Long: " + this.uLong);
     }).catch((error) => {
       console.log('Error getting location', error);
     });

     //If have lat/long look for friends
     this.afs.collection<any>('humanProfile').valueChanges().forEach(data => {
       data.forEach(person => {
         //Searches every person in the database.
        if(person['UID'] != this.uid){
          //TODO: Compare to lat longs and print the person out. Should try to obtain the id of the item
          console.log(person['firstName']);
          this.oLat = person['currLat'];
          this.oLong = person['currLong'];

          //TODO: Break into function if possible.
          //Figure out issue of longitude getting wrapped around the earth
          if(this.oLat != undefined && this.oLong != undefined)
          {
          //69 converts lat/long into miles roughly
          var xUser = this.uLat * 69.0; 
          var xPal = this.oLat * 69.0;
          var yUser = this.uLong * 69.0;
          var yPal = this.oLong * 69.0;
          //console.log(xUser + ", " + xPal + ", " + yUser + ", " + yPal);
          var dx = Math.abs(xUser - xPal);
          var dy = Math.abs(yUser - yPal);
          //console.log(dx + ", " + dy);
          
          var dist = Math.sqrt(Math.pow(dx, 2.0) + Math.pow(dy, 2.0));
          
          //GOT distance: Only print if close enough
          console.log(dist);

          //Change to profile pic and store UID for info retrieval
          this.possiblePals.push(person['firstName']);
          if(person['UID'] != undefined)
            this.possiblePalID.push(person['UID']);
            //Update friendList
            
          }
        }
       })

       
     
       //console.log(this.possiblePals);
       //console.log(this.possiblePalID);
       //GETS USER DOC AND ADDS PALS
       //TODO: ONLY ADD A PAL BY CLICKING ON THEM:

     });//End get doc
  }


   updatePals(){//TODO: update pals to database here somehow!!
    this.afs.collection<any>('humanProfile').doc(this.uid).update({ 
      friendList: this.possiblePalID
    });
  }

  
  updatePal(newPal){//TODO: update pals to database here somehow!!
    //TODO: add one item: https://stackoverflow.com/questions/46757614/how-to-update-an-array-of-objects-with-firestore
    //  this.afs.collection<any>('humanProfile').doc(this.uid).update({ 
  //    friendList: this.possiblePalID
  //  });
  }
}
