import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenufDetailsPage } from './menuf-details.page';

const routes: Routes = [
  {
    path: '',
    component: MenufDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenufDetailsPageRoutingModule {}
