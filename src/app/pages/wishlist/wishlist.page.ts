import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { api_urls } from "../../../environments/environment";
import { UtilsService } from "src/app/services/utils.service";
import { ApiService } from "src/app/services/api.service";
import { CartService } from "src/app/services/cart.service";
import { AppDataService } from "src/app/services/app-data.service";
import { ModalController, Platform } from "@ionic/angular";
import { LoginPage } from "../login/login.page";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-wishlist",
  templateUrl: "./wishlist.page.html",
  styleUrls: ["./wishlist.page.scss"],
})
export class WishlistPage implements OnInit {
  products: any;
  isAuthenticated: BehaviorSubject<boolean>;

  constructor(
    private platform: Platform,
    private utils: UtilsService,
    private api: ApiService,
    private cart: CartService,
    private appData: AppDataService,
    public modalController: ModalController,
    public router: Router
  ) {
    console.log(window.location.pathname);
    // this.platform.backButton.subscribe(() => {
    //    utils.backButtonPress(window.location.pathname);
    // });
  }

  ngOnInit() {
    this.isAuthenticated = this.appData.isAuthenticated;
    console.log(this.appData.playerID);
    
  }

  ionViewWillEnter() {
    if (this.isAuthenticated.value) {
      this.loadProducts();
    }
  }

  async loadProducts() {
    this.utils.presentLoading("");

    try {
      this.products = await this.api.get(api_urls.wishlist).toPromise();
      console.log(this.products);
      this.utils.dismissLoading();
    } catch (error) {
      console.log(error);
      this.utils.dismissLoading();

      if (error.status == 404) {
        this.products = [];
        this.utils.presentToast(error.error.error);
      }
    }
  }

  openProduct(slug) {
    this.router.navigate(["/product"], { queryParams: { slug: slug } });
  }

  async delete(product) {
    try {
      let res = await this.api
        .delete(api_urls.wishlist + "/" + product.id + api_urls.del_wishlist)
        .toPromise();
      console.log(res);
    } catch (error) {
      console.log(error);
    }

    this.loadProducts();
  }

  addToCart(product) {
    let data = {
      quantity: 1,
    };
    console.log(data);
    this.cart.addToCart(product.slug, data);
  }

  async loadWishes(link, event?) {
    if (link) {
      let data = await this.api.get_full(link).toPromise();
      console.log(data);

      this.products["data"] = this.products["data"].concat(data.data);
      this.products["links"] = data.links;
      this.products["meta"] = data.meta;
    }

    if (event) {
      event.target.complete();
    }
  }

  async login() {
    const modal = await this.modalController.create({
      component: LoginPage,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
    if (data.isAuthenticated) {
      this.isAuthenticated.next(data.isAuthenticated);
      this.loadProducts();
    }
  }
}
