import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyProfileViewPage } from './my-profile-view';

@NgModule({
  declarations: [
    MyProfileViewPage,
  ],
  imports: [
    IonicPageModule.forChild(MyProfileViewPage),
  ],
})
export class MyProfileViewPageModule {}
