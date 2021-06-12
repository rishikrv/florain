import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersDetailsPage } from './orders-details.page';

const routes: Routes = [
  {
    path: '',
    component: OrdersDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersDetailsPageRoutingModule {}
