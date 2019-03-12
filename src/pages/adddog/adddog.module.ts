import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdddogPage } from './adddog';

@NgModule({
  declarations: [
    AdddogPage,
  ],
  imports: [
    IonicPageModule.forChild(AdddogPage),
  ],
})
export class AdddogPageModule {}
