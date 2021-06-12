import { Component } from "@angular/core";

import { AlertController, NavController, Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AppDataService } from "./services/app-data.service";

import { ApiService } from "./services/api.service";
import { TranslateService } from "@ngx-translate/core";
import { OneSignal } from "@ionic-native/onesignal/ngx";
import { CartService } from "./services/cart.service";
import { BehaviorSubject } from "rxjs";
import { UtilsService } from "./services/utils.service";


@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  lang: any;

  cartItemCount: BehaviorSubject<number>;
  processing = false;


  constructor(
    private cartService: CartService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appData: AppDataService,
    private api: ApiService,
    private alert: AlertController,
    public translate: TranslateService,
    private oneSignal: OneSignal,
    private nav: NavController,
    private utils: UtilsService,
  ) {
    this.initializeApp();
   }

  initializeApp() {
    console.log(window.location.pathname);
    this.platform.backButton.subscribe(() => {
       this.utils.backButtonPress(window.location.pathname);
    });


    this.cartItemCount = this.cartService.getCartItemCount();
    this.platform.ready().then(() => {
      // this.backgroundMode.enable();
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#ffffff");
      this.splashScreen.hide();

      this.lang = localStorage.getItem("lang") || "en";
      this.translate.setDefaultLang(this.lang);
      this.translate.use(this.lang);

      this.getToken();
      // this.pushNotification.initPush();
      this.initPushNotifications();
    });
  }

  getToken() {
    this.appData.getValue("isAuthenticated").then((user) => {
      // console.log(user);
      
      if (user == true || user === true || user == "true") {
        this.appData.isAuthenticated.next(true);
        this.appData.getValue("currentUser").then((currrentUser) => {
          if (currrentUser) {
            this.api.token = JSON.parse(currrentUser).api_token;
            // console.log(this.api.token);
          }
        });
      } else {
        console.log("user not authenticated");
        this.appData.isAuthenticated.next(false);
      }
    });
  }

  initPushNotifications() {
    this.oneSignal.startInit(
      "c66034ca-85e9-42aa-84e0-4207ebd6f44c",
      "556071354289"
    );

    this.oneSignal.getIds().then(ids => { 
      console.log(JSON.stringify(ids.userId));
      // this.storage.set('playersID', ids.userId); 
      this.appData.playerID = JSON.stringify(ids.userId);
    });

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.Notification
    );

    this.oneSignal.handleNotificationReceived().subscribe((data) => {

      console.log('noti receive');
      // this.oneSignal.enableSound(true);


      // do something when notification is received
      let msg = data.payload.body
      let title = data.payload.title

      console.log(msg, title);
      
      // let additionalData = data.payload.additionalData;

      // this.showAlert(title, msg, additionalData.task);
      // this.utils.presentAlert(title, msg);
    });

    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      console.log('noti receive and opend');
      // this.oneSignal.enableSound(true);
      // do something when a notification is opened
      // let additionalData = data.notification.payload.additionalData;
      // this.showAlert("Notification Opend", "You already read this before", additionalData.task);
    });

    this.oneSignal.endInit();
  }
}
