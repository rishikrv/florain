import { Component, OnInit } from "@angular/core";
import { api_urls } from "../../../environments/environment";
import { Router } from "@angular/router";
import {
  NavController,
  ModalController,
  PopoverController,
  Platform,
} from "@ionic/angular";
import { ApiService } from "src/app/services/api.service";
import { UtilsService } from "src/app/services/utils.service";
import { AppDataService } from "src/app/services/app-data.service";
import { LoginPage } from "../login/login.page";
import { BehaviorSubject } from "rxjs";
import { CartService } from "src/app/services/cart.service";
import { LanguageOptionsComponent } from "src/app/components/language-options/language-options.component";

@Component({
  selector: "app-account",
  templateUrl: "./account.page.html",
  styleUrls: ["./account.page.scss"],
})
export class AccountPage implements OnInit {
  dashboard: any;
  authenticationStatus: BehaviorSubject<boolean>;
  isAuthenticated: boolean;
  constructor(
    private platform: Platform,
    private cart: CartService,
    private navCtrl: NavController,
    private api: ApiService,
    private utils: UtilsService,
    private data: AppDataService,
    public modalController: ModalController,
    public popoverController: PopoverController
  ) {
    this.isAuthenticated = false;
  //   this.platform.backButton.subscribe(() => {
  //     utils.backButtonPress(window.location.pathname);
  //  });
  }

  ngOnInit() {
    this.authenticationStatus = this.data.isAuthenticated;
    this.isAuthenticated = this.authenticationStatus.value;
    this.authenticationStatus.subscribe((status) => {
      this.isAuthenticated = status;
    });
  }

  ionViewWillEnter() {
    if (this.isAuthenticated === true) {
      this.loadDashboard();
    }
  }

  async loadDashboard() {
    this.utils.presentLoading("");

    try {
      let response = await this.api.get(api_urls.dashboard).toPromise();
      this.dashboard = response.data;

      console.log(this.dashboard);
      this.utils.dismissLoading();
    } catch (error) {
      console.log(error);
      this.utils.dismissLoading();
      this.utils.presentToast(error.error.messagge);
    }
  }

  openAccountDetails() {
    this.navCtrl.navigateForward(["account-details"]);
  }

  openOrders() {
    this.navCtrl.navigateForward(["orders"]);
  }

  openCoupons() {
    this.navCtrl.navigateForward(["coupons"]);
  }

  openDisputes() {
    this.navCtrl.navigateForward(["disputes"]);
  }

  aboutUs() {
    this.data.page = "about-us";
    this.navCtrl.navigateForward(["info"]);
  }

  terms() {
    this.data.page = "terms-of-use-customer";
    this.navCtrl.navigateForward(["info"]);
  }
  pp() {
    this.data.page = "privacy-policy";
    this.navCtrl.navigateForward(["info"]);
  }

  openWishlist() {
    this.navCtrl.navigateRoot(["/wishlist"]);
  }

  async login() {
    const modal = await this.modalController.create({
      component: LoginPage,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
    if (data.isAuthenticated) {
      this.authenticationStatus.next(data.isAuthenticated);
      this.loadDashboard();
    }
  }

  openPage(page) {
    this.navCtrl.navigateForward([page]);
  }

  async openLanguageOptions() {
    const popover = await this.popoverController.create({
      component: LanguageOptionsComponent,
    });
    return await popover.present();
  }

  logout() {
    this.data.setValue("isAuthenticated", null);
    this.data.setValue("currentUser", null);
    this.api.token = null;
    this.data.order = null;
    this.data.data = null;
    this.data.feedbacks = null;
    this.data.category = null;
    this.data.page = null;
    this.data.product = null;
    this.data.isAuthenticated.next(false);
    this.cart.loadCart();
    //this.navCtrl.navigateRoot(['/']);
  }
}
