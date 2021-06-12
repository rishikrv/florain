import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { UtilsService } from "src/app/services/utils.service";
import { CartService } from "src/app/services/cart.service";
import { api_urls } from "src/environments/environment";
import { NavController, ModalController } from "@ionic/angular";
import { MenufDetailsPage } from "../menuf-details/menuf-details.page";

@Component({
  selector: "app-manufacturer",
  templateUrl: "./manufacturer.page.html",
  styleUrls: ["./manufacturer.page.scss"],
})
export class ManufacturerPage implements OnInit {
  shop: any;

  rating = 0;
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private utils: UtilsService,
    private router: Router,
    private cart: CartService,
    private nav: NavController,
    public modalController: ModalController
  ) {
    this.shop = {};
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log(params);

      if (params && params.slug) {
        this.loadData(params.slug);
      }
    });
  }

  async loadData(slug) {
    this.utils.presentLoading("Please wait...");

    try {
      this.shop = (await this.api.get(api_urls.brand + slug).toPromise())[
        "data"
      ];
      console.log(this.shop);
      this.utils.dismissLoading();
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: MenufDetailsPage,
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
    this.nav.pop();
  }
}
