import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { UtilsService } from "src/app/services/utils.service";
import { api_urls } from "src/environments/environment";
import { CartService } from "src/app/services/cart.service";
import { NavController, ModalController, Platform } from "@ionic/angular";
import { ShopDetailsPage } from "../shop-details/shop-details.page";

@Component({
  selector: "app-shop",
  templateUrl: "./shop.page.html",
  styleUrls: ["./shop.page.scss"],
})
export class ShopPage implements OnInit {
  
  shop: any;
  products : any;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private utils: UtilsService,
    private router: Router,
    private platform: Platform,
    private cart: CartService,
    private nav: NavController,
    public modalController: ModalController
  ) {
    
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log(params);
      if (params && params.slugx) {
        this.loadData(params.slugx);
      }
    });
  }

  async loadData(slug) {
    let filter = {
      sort_by: "",
      free_shipping: false,
      has_offers: false,
      new_arrivals: false,
    };
    this.utils.presentLoading("Please wait...");

    try {
      let info = await this.api.get(api_urls.shop + slug).toPromise();
      console.log(info);
      this.shop = info.data;

      let res = await this.api
        .get(api_urls.shop + slug + "/listings")
        .toPromise();
      this.products = res.data;
      console.log(res);
      this.utils.dismissLoading();
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ShopDetailsPage,
      componentProps: {
        shop: this.shop,
      },
    });
    return await modal.present();
  }

  openProduct(slug) {
    this.router.navigate(["/product"], { queryParams: { slug: slug } });
  }

  addToCart(product) {
    let data = {
      quantity: 1,
    };

    console.log(data);
    this.cart.addToCart(product.slug, data);
  }

  goBack() {
    this.nav.back();
  }
}
