import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManufacturerPageRoutingModule } from './manufacturer-routing.module';

import { ManufacturerPage } from './manufacturer.page';
import { MenufDetailsPageModule } from '../menuf-details/menuf-details.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManufacturerPageRoutingModule,
    MenufDetailsPageModule
  ],
  declarations: [ManufacturerPage]
})
export class ManufacturerPageModule {}
