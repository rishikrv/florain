import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { Router } from "@angular/router";
import { UtilsService } from "src/app/services/utils.service";
import { NavController, Platform } from "@ionic/angular";
import { CartService } from "src/app/services/cart.service";
import { AppDataService } from "src/app/services/app-data.service";
import { Network } from "@ionic-native/network/ngx";
import { api_urls } from "src/environments/environment";

@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"],
})
export class SearchPage implements OnInit {
  searchProducts: any;
  searchMeta: any;
  searchMoreMeta: any;
  searchKey: any;

  constructor(
    private api: ApiService,
    private platform: Platform,
    private router: Router,
    private utils: UtilsService,
    private nav: NavController,
    private cart: CartService,
    private appData: AppDataService,
    private network: Network
  ) {
    console.log(window.location.pathname);
    // this.platform.backButton.subscribe(() => {
    //    utils.backButtonPress(window.location.pathname);
    // });
  }

  ngOnInit() {}

  async loadProducts(link, event?) {
    if (link) {
      this.searchMeta = await this.api.get_full(link).toPromise();
      this.searchProducts = this.searchProducts.concat(this.searchMeta.data);
    }

    if (event) {
      event.target.complete();
    }
  }

  search() {
    let value = this.searchKey;

    console.log(value);

    if (value == "") {
      this.searchProducts = [];
      this.searchMeta = null;
      this.searchMoreMeta = null;
      return;
    }
  }

  async onSearchChange() {
    if (this.network.type == this.network.Connection.NONE) {
      this.utils.presentToast(
        "Unable to connect to internect. Please check your internet connection and try again."
      );
    } else {
      this.utils.presentLoading("");
      let value = this.searchKey;

      console.log(value);

      if (value == "") {
        this.searchProducts = [];
        this.searchMeta = null;
        return;
      }

      try {
        this.searchMeta = await this.api
          .get(api_urls.search + value)
          .toPromise();
        this.searchProducts = this.searchMeta["data"];

        if (this.searchProducts.length == 0) {
          this.utils.presentAlert(
            "Search Alert",
            `${this.searchKey} not available`
          );
        }
        this.utils.dismissLoading();
      } catch (error) {
        this.utils.dismissLoading();
        console.log(error);
      }
    }
  }

  addToCart(product) {
    let data = {
      quantity: 1,
    };

    console.log(data);
    this.cart.addToCart(product.slug, data);
  }

  openProduct(slug) {
    this.router.navigate(["/product"], { queryParams: { slug: slug } });
  }

  goBack() {
    this.nav.back();
  }
}
