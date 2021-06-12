import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { UtilsService } from "src/app/services/utils.service";
import { api_urls } from "src/environments/environment";
import { NavController, AlertController, Platform } from "@ionic/angular";
import { AppDataService } from "src/app/services/app-data.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.page.html",
  styleUrls: ["./orders.page.scss"],
})
export class OrdersPage implements OnInit {
  orders: any;

  sections = [true, false, false];
  constructor(
    private platform: Platform,
    private api: ApiService,
    private utils: UtilsService,
    private nav: NavController,
    private data: AppDataService,
    private router: Router,
    public alertController: AlertController
  ) {
  //   this.platform.backButton.subscribe(() => {
  //     utils.backButtonPress(window.location.pathname);
  //  });
  }

  ngOnInit() {
    // this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  changeSection(id) {
    if (id == 0) {
      this.sections[0] = true;
      this.sections[1] = false;
      this.sections[2] = false;
    } else if (id == 1) {
      this.sections[0] = false;
      this.sections[1] = true;
      this.sections[2] = false;
    } else if (id == 2) {
      this.sections[0] = false;
      this.sections[1] = false;
      this.sections[2] = true;
    }
  }

  async loadData() {
    this.utils.presentLoading("Please wait...");

    try {
      this.orders = await this.api.get(api_urls.orders).toPromise();
      console.log(this.orders);
      this.utils.dismissLoading();
    } catch (error) {
      console.log(error);
      this.utils.dismissLoading();
    }
  }

  viewOrder(id) {
    this.nav.navigateForward(["orders-details"], { queryParams: { id: id } });
  }

  openDispute(order) {
    this.router.navigate(["dispute"], { queryParams: { order_id: order.id }});
  }

  evaluateOrder(order) {
    this.data.order = order;
    this.nav.navigateForward(["evaluate"]);
  }

  goBack() {
    this.nav.back();
  }

  openProduct(slug) {
    this.router.navigate(["/product"], { queryParams: { slug: slug } });
  }

  async loadOrders(link, event?) {
    if (link) {
      let data = await this.api.get_full(link).toPromise();
      this.orders["data"] = this.orders["data"].concat(data.data);
      this.orders["links"] = data.links;
      this.orders["meta"] = data.meta;
    }

    if (event) {
      event.target.complete();
    }
  }

  async confirmOrder(id) {
    this.utils.presentLoading("Please wait...");

    try {
      let res = (
        await this.api
          .post(api_urls.order + id + api_urls.goodsReceived, {})
          .toPromise()
      )["data"];
      console.log(res);
      this.orders = await this.api.get(api_urls.orders).toPromise();

      console.log(this.orders);
      this.utils.dismissLoading();
    } catch (error) {
      console.log(error);
      this.utils.dismissLoading();
    }
  }

  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      header: "Confirm!",
      message: "Do you really want to confirm received?",
      cssClass: "custom-alert",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Okay",
          handler: () => {
            this.confirmOrder(id);
          },
        },
      ],
    });

    await alert.present();
  }

  track(order) {
    console.log("track here");
  }

  contactSeller(order) {
    this.data.order = order;
    this.nav.navigateForward(["conversation"]);
  }
}
