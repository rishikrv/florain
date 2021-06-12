import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisputeDetailsPage } from './dispute-details.page';

const routes: Routes = [
  {
    path: '',
    component: DisputeDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisputeDetailsPageRoutingModule {}
