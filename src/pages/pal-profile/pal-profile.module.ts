import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PalProfilePage } from './pal-profile';

@NgModule({
  declarations: [
    PalProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(PalProfilePage),
  ],
})
export class PalProfilePageModule {}
