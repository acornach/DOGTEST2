import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PalchatPage } from '../palchat/palchat';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ConditionalExpr } from '@angular/compiler';

/**
 * Generated class for the DogsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dogs',
  templateUrl: 'dogs.html',
})
export class DogsPage {
  uid: string;

  allDogs: Array<string>;
  allDogs1: Array<string>;
  allDogs2: Array<string>;
  allDogs3: Array<string>;
  allDogs4: Array<string>;
  allDogs5: Array<string>;
  allDogs6: Array<string>;
  allDogs7: Array<string>;
  allDogs8: Array<string>;
  allDogs9: Array<string>;
  allDogs10: Array<string>;
  allDogs11: Array<string>;
  allDogs12: Array<string>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, private geolocation: Geolocation,private afs: AngularFirestore ) {
   // this.events.subscribe('data:created', (data) => {	//Gets uid passed into from login page
   //   console.log( data);
     
  
   // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DogsPage');
    this.uid = localStorage.getItem("uid");
    //Initialize all arrays with one empty string so push works
    this.allDogs = [""];
    this.allDogs1 = [""];
    this.allDogs2 = [""];
    this.allDogs3 = [""];
    this.allDogs4 = [""];
    this.allDogs5 = [""];
    this.allDogs6 = [""];
    this.allDogs7 = [""];
    this.allDogs8 = [""];
    this.allDogs9 = [""];
    this.allDogs10 = [""];
    this.allDogs11 = [""];
    this.allDogs12 = [""];
    this.afs.collection('dogProfile').valueChanges().forEach(res => {
      res.forEach(dog => {
        if(dog['name'] != undefined)
          this.allDogs.push(dog['name']);
        if(dog['intense'] == true && dog['social'] == true && dog['playStyle'] == "contact")
          this.allDogs1.push(dog['name']);
          if(dog['intense'] == true && dog['social'] == true && dog['playStyle'] == "interact")
            this.allDogs2.push(dog['name']);
            if(dog['intense'] == true && dog['social'] == true && dog['playStyle'] == "none")
              this.allDogs3.push(dog['name']);
              if(dog['intense'] == true && dog['social'] == false && dog['playStyle'] == "contact")
                this.allDogs4.push(dog['name']);
                if(dog['intense'] == true && dog['social'] == false && dog['playStyle'] == "interact")
                  this.allDogs5.push(dog['name']);
                  if(dog['intense'] == true && dog['social'] == false && dog['playStyle'] == "none")
                    this.allDogs6.push(dog['name']);
                    if(dog['intense'] == false && dog['social'] == true && dog['playStyle'] == "contact")
                      this.allDogs7.push(dog['name']);
                      if(dog['intense'] == false && dog['social'] == true && dog['playStyle'] == "interact")
                        this.allDogs8.push(dog['name']);
                        if(dog['intense'] == false && dog['social'] == true && dog['playStyle'] == "none")
                          this.allDogs9.push(dog['name']);
                          if(dog['intense'] == false && dog['social'] == false && dog['playStyle'] == "contact")
                            this.allDogs10.push(dog['name']);
                            if(dog['intense'] == false && dog['social'] == false && dog['playStyle'] == "interact")
                              this.allDogs11.push(dog['name']);
                              if(dog['intense'] == false && dog['social'] == false && dog['playStyle'] == "none")
                                this.allDogs12.push(dog['name']);
      })
    });
  }

}
