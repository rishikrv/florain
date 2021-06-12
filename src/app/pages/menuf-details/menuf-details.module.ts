import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenufDetailsPageRoutingModule } from './menuf-details-routing.module';

import { MenufDetailsPage } from './menuf-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenufDetailsPageRoutingModule
  ],
  declarations: [MenufDetailsPage],
  entryComponents:[MenufDetailsPage]
})
export class MenufDetailsPageModule {}
