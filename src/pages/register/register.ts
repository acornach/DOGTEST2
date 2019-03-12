import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { TestdatabasePage } from '../testdatabase/testdatabase';
import { Events } from 'ionic-angular';
import { HomePage } from '../home/home';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
 
	@ViewChild('username') user;
	@ViewChild('password') password;
	uid: string;
	//Constructor for RegisterPage
	//Includes various Angular Controllers and AngularFireAuth for registering to Firebase
	constructor(private fire: AngularFireAuth, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public events: Events) {
	}
	
	//Showing messages upon login attempt
	alert(message: string){
		this.alertCtrl.create({//Create message
			//Message creation code from ionic AlertCtrl documentation
			title: 'Info',
			subTitle: message, //message passed in as a parameter
			buttons: ['OK']
		}).present();//Display message after creation
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterPage');
	}
	
	//Used to send username to other tab
	sendData(data) {
		this.events.publish('data:created', data);
		console.log('Published : ', data);
	}
	
	//Method fires when user attempts to register a new user
	registerUser(){
		this.fire.auth.createUserWithEmailAndPassword(this.user.value, this.password.value)
		.then(data => {
			//call this.alert to access our custom alert function
			this.alert("Successfully Registerd User " + this.user.value);	//Pass in userName to alert
			this.uid = this.fire.auth.currentUser.uid;
			console.log('got data', data);
			this.navCtrl.push( HomePage )
			.then(() => {
				this.events.publish('data:created', this.uid);
				console.log('Published', this.uid);
		});
			
		})
		.catch(error => {
			//call this.alert to access our custom alert function
			this.alert(error.message);	//Pass Error messag into the alert
			console.log('got an error: ', error);	
		})
		console.log(this.user.value, this.password.value);  
	}
}
