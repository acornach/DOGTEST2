import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Events } from 'ionic-angular';

//TODO: Fix this loginPage to some new page (main home page for app users)
import { TestdatabasePage } from '../testdatabase/testdatabase';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  //Variables within LoginPage
  @ViewChild('username') user;
  @ViewChild('password') password;
  uid: string;	//Store the user's id for use in the database
  

    constructor(private fire:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public events: Events) {

	}
	
	
    ionViewDidLoad() {
    	console.log('ionViewDidLoad LoginPage');
    }

    alert(message: string){
    	this.alertCtrl.create({
	title: 'Info',
	subTitle: message,
	buttons: ['OK']
    
    	}).present();
    }
    
    signInUser(){//Should validate a valid email address before sending to firebase
    	this.fire.auth.signInWithEmailAndPassword(this.user.value, this.password.value)
		.then( data => {//Firebase will log in successfully
			//this.alert('Successful login');//alert the user
			this.uid = this.fire.auth.currentUser.uid;
			this.navCtrl.push( HomePage )
			.then(() => {
				this.events.publish('data:created', this.uid);
				console.log('Published', this.uid);
		});
		
		
		//this.sendData(this.uid);
		//this.alert(this.uid);
		//console.log('got data', data);//logs entire data returned by firebase
		//console.log('got data', this.fire.auth.currentUser.displayName);//logs just the currentUser name
		//console.log('email Verified: ', this.fire.auth.currentUser.emailVerified);//is email verified?
		
		//Go to other page on successful login
		//this.navCtrl.push( TestdatabasePage );
	})
	.catch(error => {
	//Unsuccessful login
		this.alert(error.message);//display error message to user
		console.log('error: ', error);
	})
	console.log('Would like to sign in with ', this.user.value, this.password.value); 
  }

}
