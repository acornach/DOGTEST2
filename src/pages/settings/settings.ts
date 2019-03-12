import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { ChangepassPage } from '../changepass/changepass';
import { SearchradiusPage } from '../searchradius/searchradius';
import { HelpPage } from '../help/help';
import { LogoutPage } from '../logout/logout';
import { UpgradePage } from '../upgrade/upgrade';


/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
	uid: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
	
	this.events.subscribe('data:created', (data) => {	//Gets uid passed into from login page
		console.log( data);
		this.uid = data;
	});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

    changePass(){
  	this.navCtrl.push(ChangepassPage)
	.then(() => {
				this.events.publish('data:created', this.uid);
				console.log('Published', this.uid);
	});
  }
  
  searchRadius(){
  	this.navCtrl.push(SearchradiusPage)
	.then(() => {
				this.events.publish('data:created', this.uid);
				console.log('Published', this.uid);
	});
  }
  
  HelpPage(){
  	this.navCtrl.push(HelpPage)
	.then(() => {
				this.events.publish('data:created', this.uid);
				console.log('Published', this.uid);
	});
  }
  
  logoutPage(){
  	this.navCtrl.push(LogoutPage)
	.then(() => {
				this.events.publish('data:created', this.uid);
				console.log('Published', this.uid);
	});
  }
  
  upgradePage(){
  	this.navCtrl.push(UpgradePage)
	.then(() => {
				this.events.publish('data:created', this.uid);
				console.log('Published', this.uid);
	});
  }


  
}
