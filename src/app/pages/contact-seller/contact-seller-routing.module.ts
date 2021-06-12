import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactSellerPage } from './contact-seller.page';

const routes: Routes = [
  {
    path: '',
    component: ContactSellerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactSellerPageRoutingModule {}
