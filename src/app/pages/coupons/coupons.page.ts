import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ApiService } from "src/app/services/api.service";
import { UtilsService } from "src/app/services/utils.service";
import { Clipboard } from "@ionic-native/clipboard/ngx";

@Component({
  selector: "app-coupons",
  templateUrl: "./coupons.page.html",
  styleUrls: ["./coupons.page.scss"],
})
export class CouponsPage implements OnInit {
  coupons: any;

  constructor(
    private nav: NavController,
    private api: ApiService,
    private utils: UtilsService,
    private clipboard: Clipboard
  ) {}

  ngOnInit() {
    this.loadData();
  }

  goBack() {
    this.nav.pop();
  }

  copyCode(code) {
    this.clipboard.copy(code).then((_) => {
      this.utils.presentToast("Code Copied");
    });
  }

  async loadData() {
    try {
      this.utils.presentLoading("");

      this.coupons = await this.api.get("coupons").toPromise();
      console.log(this.coupons);

      this.utils.dismissLoading();
    } catch (error) {
      console.log(error);

      this.utils.dismissLoading();
    }
  }

  async loadCoupons(link, event?) {
    if (link) {
      let data = await this.api.get_full(link).toPromise();
      this.coupons["data"] = this.coupons["data"].concat(data.data);
      this.coupons["links"] = data.links;
      this.coupons["meta"] = data.meta;
    }

    if (event) {
      event.target.complete();
    }
  }
}
