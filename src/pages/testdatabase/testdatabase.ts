import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TestdatabasePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-testdatabase',
  templateUrl: 'testdatabase.html',
})
export class TestdatabasePage {

	uid: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
	
	this.events.subscribe('data:created', (data) => {
		console.log( data);
		this.uid = data;
	});
  
  }
  
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestdatabasePage');
	

console.log( this.uid);
  }

}
