import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { IonicStorageModule } from "@ionic/storage";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";
import { InterceptorService } from "./services/interceptor.service";
import { ReactiveFormsModule } from "@angular/forms";
// import { Facebook } from "@ionic-native/facebook/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
// import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { Clipboard } from "@ionic-native/clipboard/ngx";
import { Network } from "@ionic-native/network/ngx";
import { MediaCapture } from "@ionic-native/media-capture/ngx";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { OneSignal } from "@ionic-native/onesignal/ngx";

import { BackgroundMode } from '@ionic-native/background-mode/ngx';

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    BackgroundMode,
    StatusBar,
    SplashScreen,
    // Facebook,
    SocialSharing,
    // GooglePlus,
    File,
    Network,
    Clipboard,
    FileTransfer,
    MediaCapture,
    ImagePicker,
    OneSignal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
