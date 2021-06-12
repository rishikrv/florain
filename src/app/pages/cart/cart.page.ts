import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { api_urls } from "../../../environments/environment";
import { CartService } from "src/app/services/cart.service";
import { BehaviorSubject } from "rxjs";
import { UtilsService } from "src/app/services/utils.service";
import { ApiService } from "src/app/services/api.service";
import { NavController, Platform } from "@ionic/angular";
import { AppDataService } from "src/app/services/app-data.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
})
export class CartPage implements OnInit {
  cartItemCount: BehaviorSubject<number>;
  cartLists = [];
  selectedOrder: any;
  selectedItemIndex: number;

  constructor(
    private platform: Platform,
    private router: Router,
    private cart: CartService,
    private nav: NavController,
    private appData: AppDataService,
    private utils: UtilsService,
    private api: ApiService
  ) {
  //   this.platform.backButton.subscribe(() => {
  //     utils.backButtonPress(window.location.pathname);
  //  });
  }

  ngOnInit() {
    this.cart.loadCart();
  }

  ionViewWillEnter() {
    this.loadCart();
  }

  openProduct(slug) {
    this.router.navigate(["/product"], { queryParams: { slug: slug } });
  }

  loadCart() {
    this.cartItemCount = this.cart.getCartItemCount();
    this.cartLists = this.cart.getCart();

    if (this.cartLists.length > 0) {
      this.utils.presentToast("Swipe left to remove item from cart.");
    }

    if (this.selectedItemIndex >= 0) {
      this.selectedOrder = this.cartLists[this.selectedItemIndex];
    }

    console.log(this.cartLists);
  }

  async delete(prod, cart) {
    this.utils.presentLoading("Please wait");
    var p = await this.cart.delete(prod, cart);
    if(p == true){
      let response = await this.api.get(api_urls.cartList).toPromise();
      this.cartLists = response.data;      
      this.utils.dismissLoading();
    } else {
      this.utils.dismissLoading();

    }
    
    //this.selectedOrder = {};
    // this.cart.loadCart();
    // this.cart
  }

  shopChange(event) {
    console.log(event.detail.value);

    this.selectedItemIndex = event.detail.value;
    this.selectedOrder = this.cartLists[this.selectedItemIndex];
    console.log(this.cartLists[event.detail.value]);
  }

  checkout() {
    this.appData.order = this.selectedOrder;
    this.nav.navigateForward(["checkout"]);
  }

  async updateQuantity(cartItem, item, cartId, itemSlug, op) {
    this.utils.presentLoading("");

    try {
      let data = {};
      if (op == "ad") {
        data = {
          item: itemSlug,
          quantity: ++this.cartLists[cartItem].items[item].quantity,
          _method: "PUT",
        };
      } else {
        data = {
          item: itemSlug,
          quantity: --this.cartLists[cartItem].items[item].quantity,
          _method: "PUT",
        };
      }

      console.log(data);

      let res = await this.api
        .post(api_urls.cartUpdate + cartId + "/update", data)
        .toPromise();
      console.log(res);
      //this.utils.presentToast(res.message);
      this.utils.dismissLoading();
      this.cartLists[cartItem] = res.cart;
      this.selectedOrder = res.cart;
      this.selectedItemIndex = cartItem;
    } catch (error) {
      console.log(error);
      this.utils.dismissLoading();
    }
  }
}
