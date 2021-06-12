import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ApiService } from "./api.service";
import { api_urls } from "../../environments/environment";
import { UtilsService } from "./utils.service";
import { AppDataService } from "./app-data.service";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cart = [];
  private cartItemCount = new BehaviorSubject(0);

  constructor(
    private api: ApiService,
    private utils: UtilsService,

    // private data: AppDataService
  ) {}

  async loadCart() {
    try {
      let response = await this.api.get(api_urls.cartList).toPromise();
      this.cart = response.data;

      this.updateCartCount();
    } catch (error) {
      console.log(error);
    }
  }

  getCart() {
    return this.cart;
  }

  getCartItemCount() {
    return this.cartItemCount;
  }

  updateCartCount() {
    if (this.cart.length > 0) {
      let count = 0;
      this.cart.forEach((item) => {
        count += item.items.length;
        this.cartItemCount.next(count);
      });
    } else {
      this.cartItemCount.next(0);
    }
  }

  async addToCart(slug, data) {
    this.utils.presentLoading("Please wait");

    try {
      let response = await this.api
        .post(api_urls.addTocart + slug, data)
        .toPromise();

      this.utils.presentToast("Added to cart");

      this.utils.dismissLoading();
      this.loadCart();
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
      this.utils.presentAlert("Cart", error.error.message);
    }
  }

  async addToWishlist(slug) {
    this.utils.presentLoading("Please wait");

    try {
      let response = await this.api
        .get(api_urls.wishlist + "/" + slug + api_urls.addToWhishlist)
        .toPromise();
      console.log(response);

      this.utils.presentToast("Added to Wishlist");

      this.utils.dismissLoading();
    } catch (error) {
      this.utils.dismissLoading();
      if (error.error.message) {
        this.utils.presentAlert("Error", error.error.message);
      }

      console.log(error);
    }
  }

  async delete(prod, cart) {
   

    let data = { cart: cart, item: prod, _method: "DELETE" };

    try {
      let res = await this.api.post(api_urls.rem_cartItm, data).toPromise();
      console.log(res);
      this.utils.presentToast(res.message);
      this.loadCart();
      return true;
    } catch (error) {
      console.log(error);
      this.utils.presentAlert("Cart", error.error.message);
      return false;
    }
  }
}
