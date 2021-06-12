import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { api_urls } from "../../../environments/environment";
import { UtilsService } from "src/app/services/utils.service";
import { ApiService } from "src/app/services/api.service";
import { ModalController, NavController, Platform } from "@ionic/angular";

@Component({
  selector: "app-vendors",
  templateUrl: "./vendors.page.html",
  styleUrls: ["./vendors.page.scss"],
})
export class VendorsPage implements OnInit {
  shops: any;
  constructor(
    private platform: Platform,
    private utils: UtilsService,
    private router: Router,
    private api: ApiService,
    public modalController: ModalController,
    // public nav: NavController
  ) {
    console.log(window.location.pathname);
    // this.platform.backButton.subscribe(() => {
    //    utils.backButtonPress(window.location.pathname);
    // });
  }

  ngOnInit() {
    this.loadShops();
  }

  async loadShops() {
    try {
      this.utils.presentLoading("");
      this.shops = (await this.api.get("shops").toPromise())["data"];
    } catch (error) {
      console.log(error);
    } finally {
      this.utils.dismissLoading();
    }
  }

  openShop(slug) {
    this.router.navigate(["/shop"], { queryParams: { slugx: slug } });
    // this.nav.navigateForward(["shop", { slugx: slug }]);
  }
  
}
