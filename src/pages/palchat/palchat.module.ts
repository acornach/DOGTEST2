import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PalchatPage } from './palchat';

@NgModule({
  declarations: [
    PalchatPage,
  ],
  imports: [
    IonicPageModule.forChild(PalchatPage),
  ],
})
export class PalchatPageModule {}
