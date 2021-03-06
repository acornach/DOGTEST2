import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';

import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { TestdatabasePage } from '../pages/testdatabase/testdatabase';
import { StartupPage } from '../pages/startup/startup';
import { AdddogPage } from '../pages/adddog/adddog';
import { ProfilePage } from '../pages/profile/profile';
import { SearchingPage } from '../pages/searching/searching';
import { PalsPage } from '../pages/pals/pals';
import { SettingsPage } from '../pages/settings/settings';
import { ChangepassPage } from '../pages/changepass/changepass';
import { SearchradiusPage } from '../pages/searchradius/searchradius';
import { HelpPage } from '../pages/help/help';
import { LogoutPage } from '../pages/logout/logout';
import { UpgradePage } from '../pages/upgrade/upgrade';
import { PalchatPage } from '../pages/palchat/palchat';
import { AddpalchatroomPage } from '../pages/addpalchatroom/addpalchatroom';
import { ChatServiceProvider } from '../providers/chat-service/chat-service';
import { DogsPage } from '../pages/dogs/dogs';
import { PalProfilePage } from '../pages/pal-profile/pal-profile';
import { MyProfileViewPage } from '../pages/my-profile-view/my-profile-view'
//import { FcmProvider } from '../providers/fcm/fcm';
import { FCM } from '@ionic-native/fcm';

const firebaseAuth = {
	apiKey: "AIzaSyB5CXbl5EfLlxcNHkh0rrVoalEuFq9jt9U",
	authDomain: "firetest1-ccc03.firebaseapp.com",
	databaseURL: "https://firetest1-ccc03.firebaseio.com",
	projectId: "firetest1-ccc03",
	storageBucket: "firetest1-ccc03.appspot.com",
	messagingSenderId: "551343712590"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
		TestdatabasePage,
		StartupPage,
		AdddogPage,
		ProfilePage,
		SearchingPage,
		PalsPage,
		SettingsPage,
		ChangepassPage,
		SearchradiusPage,
		HelpPage,
		LogoutPage,
		UpgradePage,
		PalchatPage,
		AddpalchatroomPage,
		DogsPage,
		PalProfilePage,
		MyProfileViewPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
	AngularFireModule.initializeApp(firebaseAuth),
	AngularFireAuthModule,
	AngularFireDatabaseModule,
	AngularFirestoreModule
	
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
		TestdatabasePage,
		StartupPage,
		AdddogPage,
		ProfilePage,
		SearchingPage,
		PalsPage,
		SettingsPage,
		ChangepassPage,
		SearchradiusPage,
		HelpPage,
		LogoutPage,
		UpgradePage,
		PalchatPage,
		AddpalchatroomPage,
		DogsPage,
		PalProfilePage,
		MyProfileViewPage
  ],
  providers: [
    StatusBar,
		SplashScreen,
		Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
		ChatServiceProvider,
		Firebase,
		FCM
  ]
})
export class AppModule {}
