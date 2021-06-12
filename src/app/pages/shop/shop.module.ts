import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopPageRoutingModule } from './shop-routing.module';

import { ShopPage } from './shop.page';
import { ShopDetailsPageModule } from '../shop-details/shop-details.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopPageRoutingModule,
    ShopDetailsPageModule
  ],
  declarations: [ShopPage]
})
export class ShopPageModule {}
