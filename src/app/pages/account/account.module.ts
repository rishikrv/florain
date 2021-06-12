import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AccountPageRoutingModule } from "./account-routing.module";

import { AccountPage } from "./account.page";
import { LoginPageModule } from "../login/login.module";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { LanguageOptionsComponent } from "src/app/components/language-options/language-options.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPageRoutingModule,
    LoginPageModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [AccountPage, LanguageOptionsComponent],
  entryComponents: [LanguageOptionsComponent],
})
export class AccountPageModule {}
