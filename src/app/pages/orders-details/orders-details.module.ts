import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OrdersDetailsPageRoutingModule } from "./orders-details-routing.module";

import { OrdersDetailsPage } from "./orders-details.page";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersDetailsPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [OrdersDetailsPage],
})
export class OrdersDetailsPageModule {}
