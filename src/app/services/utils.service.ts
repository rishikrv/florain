import { Injectable } from "@angular/core";
import {
  AlertController,
  ToastController,
  LoadingController,
  NavController,
} from "@ionic/angular";
import { async } from "@angular/core/testing";

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  loading: any;

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    private nav: NavController,
    public loadingController: LoadingController
  ) {}

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      cssClass: "custom-alert",
      buttons: ["OK"],
    });

    await alert.present();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: "middle",
    });
    toast.present();
  }

  presentLoading(message) {
    this.loadingController.getTop().then(async (hasLoading) => {
      if (!hasLoading) {
        this.loading = await this.loadingController.create({
          message:
            '<ion-img src="/assets/loading.svg" alt="loading..."></ion-img>',
          translucent: true,
          showBackdrop: true,
          spinner: null,
          cssClass: "custom-loading",
        });
        await this.loading.present();
      }
    });
  }

  dismissLoading() {
    this.loadingController.getTop().then((hasLoading) => {
      if (hasLoading) {
        this.loading.dismiss();
      }
    });
  }

  backButtonPress(location) {
    console.log(location);
    if (location == "/home") {
      navigator['app'].exitApp();
    } else if (window.location.pathname == "/account") {
      navigator['app'].exitApp();
    } else if (window.location.pathname == "/vendors") {
      navigator['app'].exitApp();
    } else if (window.location.pathname == "/cart") {
      navigator['app'].exitApp();
    } else if (window.location.pathname == "/wishlist") {
      navigator['app'].exitApp();
    } else {
      // this.nav.pop();
      console.log('back button pressed');
      
      window.history.back()
    }
  }
}
