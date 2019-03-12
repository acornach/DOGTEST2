import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestdatabasePage } from './testdatabase';

@NgModule({
  declarations: [
    TestdatabasePage,
  ],
  imports: [
    IonicPageModule.forChild(TestdatabasePage),
  ],
})
export class TestdatabasePageModule {}
