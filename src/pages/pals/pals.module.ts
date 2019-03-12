import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PalsPage } from './pals';

@NgModule({
  declarations: [
    PalsPage,
  ],
  imports: [
    IonicPageModule.forChild(PalsPage),
  ],
})
export class PalsPageModule {}
