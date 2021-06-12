import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManufacturerPage } from './manufacturer.page';

const routes: Routes = [
  {
    path: '',
    component: ManufacturerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManufacturerPageRoutingModule {}
