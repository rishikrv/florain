import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisputePage } from './dispute.page';

const routes: Routes = [
  {
    path: '',
    component: DisputePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisputePageRoutingModule {}
