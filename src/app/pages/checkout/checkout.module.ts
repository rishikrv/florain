import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CheckoutPageRoutingModule } from "./checkout-routing.module";

import { CheckoutPage } from "./checkout.page";
import { LoginPageModule } from "../login/login.module";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { LoadingListComponent } from "src/app/components/loading-list/loading-list.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutPageRoutingModule,
    LoginPageModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [CheckoutPage, LoadingListComponent],
  entryComponents: [LoadingListComponent],
})
export class CheckoutPageModule {}
