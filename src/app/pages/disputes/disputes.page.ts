import { Component, OnInit } from "@angular/core";
import { UtilsService } from "src/app/services/utils.service";
import { ApiService } from "src/app/services/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { api_urls } from "src/environments/environment";
import { NavController, Platform } from "@ionic/angular";
import { AppDataService } from "src/app/services/app-data.service";

@Component({
  selector: "app-disputes",
  templateUrl: "./disputes.page.html",
  styleUrls: ["./disputes.page.scss"],
})
export class DisputesPage implements OnInit {
  disputes: any;
  order_id: any;
  disputeForm: any;
  dispute_types: any;

  constructor(
    private router: Router,
    private utils: UtilsService,
    private api: ApiService,
    private route: ActivatedRoute,
    private nav: NavController,
    private data: AppDataService,
    private platform: Platform
  ) {
    this.disputeForm = {};
    this.dispute_types = [];
  //   this.platform.backButton.subscribe(() => {
  //     utils.backButtonPress(window.location.pathname);
  //  });
  }

  ngOnInit() {
    //  this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  async loadData() {
    this.utils.presentLoading("Please wait...");

    try {
      this.disputes = await this.api.get(api_urls.disputes).toPromise();
      console.log(this.disputes);

      // let dis = (await this.api.get(api_urls.disputeAct+'15').toPromise());
      // console.log(dis);

      this.utils.dismissLoading();
    } catch (error) {
      console.log(error);
      this.utils.dismissLoading();
    }
  }

  openDispute(id) {
    this.router.navigate(["/dispute-details"], { queryParams: { dispute: id } });
    // this.nav.navigateForward(["dispute-details", { id: id }]);
  }

  async addDispute() {
    console.log(this.disputeForm);

    this.utils.presentLoading("Please wait...");

    try {
      let res = await this.api
        .post(
          api_urls.order + this.order_id + api_urls.dispute,
          this.disputeForm
        )
        .toPromise();
      console.log(res);

      this.utils.dismissLoading();
    } catch (error) {
      console.log(error);
      this.utils.dismissLoading();
    }
  }

  async loadDisputes(link, event?) {
    if (link) {
      let data = await this.api.get_full(link).toPromise();
      this.disputes["data"] = this.disputes["data"].concat(data.data);
      this.disputes["links"] = data.links;
      this.disputes["meta"] = data.meta;
    }

    if (event) {
      event.target.complete();
    }
  }

  contactSeller(order) {
    this.data.order = order;
    this.nav.navigateForward(["conversation"]);
  }

  async markSolved(dispute_id) {
    this.utils.presentLoading("Sending...");

    try {
      let res = await this.api
        .post(api_urls.disputeAct + dispute_id + "/solved", { _method: "PUT" })
        .toPromise();
      console.log(res);
      this.utils.dismissLoading();

      this.loadData();
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
    }
  }

  goBack() {
    this.nav.back();
  }
}
