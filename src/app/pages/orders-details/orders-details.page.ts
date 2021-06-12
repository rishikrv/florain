import { Component, OnInit } from "@angular/core";
import { UtilsService } from "src/app/services/utils.service";
import { ApiService } from "src/app/services/api.service";
import { api_urls } from "src/environments/environment";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController, Platform } from "@ionic/angular";
import { AppDataService } from "src/app/services/app-data.service";

@Component({
  selector: "app-orders-details",
  templateUrl: "./orders-details.page.html",
  styleUrls: ["./orders-details.page.scss"],
})
export class OrdersDetailsPage implements OnInit {
  order: any;
  order_id: any;
  message = "";

  constructor(
    private utils: UtilsService,
    private api: ApiService,
    private route: ActivatedRoute,
    private nav: NavController,
    private data: AppDataService,
    private router: Router,
    private platform: Platform
  ) {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      if (params && params.id) {
        this.order_id = params.id;
      }
    });
  //   this.platform.backButton.subscribe(() => {
  //     utils.backButtonPress(window.location.pathname);
  //  });
  }

  ngOnInit() {
    this.loadData();
  }

  goBack() {
    this.nav.back();
  }

  async loadData() {
    this.utils.presentLoading("Please wait...");

    try {
      this.order = (
        await this.api.get(api_urls.order + this.order_id).toPromise()
      )["data"];
      console.log(this.order);

      // this.conversation = (await this.api.get(api_urls.order + this.order_id + api_urls.orderConv).toPromise())['data'];
      // console.log(this.conversation);

      this.utils.dismissLoading();
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
    }
  }

  async confirmOrder(id) {
    this.utils.presentLoading("Please wait...");

    try {
      this.order = (
        await this.api
          .post(api_urls.order + id + api_urls.goodsReceived, {})
          .toPromise()
      )["data"];

      this.utils.dismissLoading();
    } catch (error) {
      console.log(error);
      this.utils.dismissLoading();
    }
  }

  openDispute(order) {
    this.nav.navigateForward(["dispute", { order_id: order.id }]);
  }

  evaluateOrder(order) {
    this.data.order = order;
    this.nav.navigateForward(["evaluate"]);
  }

  contactSeller() {
    this.data.order = this.order;
    this.nav.navigateForward(["conversation"]);
  }

  openProduct(slug) {
    this.router.navigate(["/product"], { queryParams: { slug: slug } });
  }

  openShop(slug) {
    this.router.navigate(["/shop"], { queryParams: { slugx: slug } });
  }
}
