import { Component, OnInit } from "@angular/core";
import { UtilsService } from "src/app/services/utils.service";
import { ApiService } from "src/app/services/api.service";
import { ActivatedRoute } from "@angular/router";
import { api_urls } from "src/environments/environment";
import { NavController, Platform } from "@ionic/angular";

@Component({
  selector: "app-dispute",
  templateUrl: "./dispute.page.html",
  styleUrls: ["./dispute.page.scss"],
})
export class DisputePage implements OnInit {
  dispute: any;
  openedDispute: any;
  order_id: any;
  disputeForm: any;
  dispute_types: any;

  constructor(
    public utils: UtilsService,
    private platform: Platform,
    public api: ApiService,
    public route: ActivatedRoute,
    public nav: NavController
  ) {
    this.disputeForm = {};
    this.dispute = {};
    this.openedDispute = {};
    this.dispute_types = [];

  //   this.platform.backButton.subscribe(() => {
  //     utils.backButtonPress(window.location.pathname);
  //  });
  }

  ngOnInit() {

    this.order_id = this.route.snapshot.queryParamMap.get('order_id');
    console.log(this.order_id);
    this.loadData();
  
  }

  async loadData() {
    // this.utils.presentLoading("Please wait...");

    try {
      this.dispute = (
        await this.api
          .get(api_urls.order + this.order_id + api_urls.dispute)
          .toPromise()
      )["data"];
      console.log(this.dispute);

      this.dispute_types = Object.values(this.dispute["dispute_type"]);

      // this.openedDispute = (await this.api.get(api_urls.disputes).toPromise())['data'];
      // console.log(this.openedDispute);

      this.utils.dismissLoading();
    } catch (error) {
      console.log(error);
      this.utils.dismissLoading();
    }
  }

  async addDispute() {
      // console.log(this.disputeForm["dispute_type_id"]);
      var confirm = this.disputeForm["order_received"];
      // console.log(this.disputeForm["refund_amount"]);

      // console.log(typeof this.disputeForm["dispute_type_id"]);
      console.log(this.disputeForm["refund_amount"]);
      console.log(this.disputeForm["product_id"]);
      
      
      if (confirm == 'false' && 
      this.disputeForm["dispute_type_id"] != '' &&
      this.disputeForm["refund_amount"] !== undefined &&
      this.disputeForm["refund_amount"] !== null){
        console.log('kkjkjkjkjk');
      
        console.log(this.disputeForm);

        this.utils.presentLoading("Please wait...");

        try {
          let res = await this.api
            .post(api_urls.order + this.order_id + api_urls.dispute, this.disputeForm).toPromise();
          console.log(res);
          this.openDispute(res.data.id);
          this.utils.dismissLoading();
        } catch (error) {
          console.log(error);
          this.utils.dismissLoading();
        }
    
      } else if (confirm == 'true' && 
      this.disputeForm["dispute_type_id"] != '' &&
      this.disputeForm["refund_amount"] !== undefined &&
      this.disputeForm["refund_amount"] !== null &&
      this.disputeForm["product_id"] !== undefined) {
        console.log('opppopopopo');
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
          this.openDispute(res.data.id);
          this.utils.dismissLoading();
        } catch (error) {
          console.log(error);
          this.utils.dismissLoading();
        }
      } else {
        this.utils.presentAlert("Alert", "Form data missing");
      }


    // if (
    //   this.disputeForm["dispute_type_id"] &&
    //   !this.disputeForm["order_received"] &&
    //   this.disputeForm["refund_amount"]
    // ) {
    //   console.log('kkjkjkjkjk');
      
    //   console.log(this.disputeForm);

    //   // this.utils.presentLoading("Please wait...");

    //   // try {
    //   //   let res = await this.api
    //   //     .post(
    //   //       api_urls.order + this.order_id + api_urls.dispute,
    //   //       this.disputeForm
    //   //     )
    //   //     .toPromise();
    //   //   console.log(res);
    //   //   this.openDispute(res.data.id);
    //   //   this.utils.dismissLoading();
    //   // } catch (error) {
    //   //   console.log(error);
    //   //   this.utils.dismissLoading();
    //   // }
    // }
    // else if (
    //   this.disputeForm["dispute_type_id"] &&
    //   this.disputeForm["order_received"] &&
    //   this.disputeForm["refund_amount"] &&
    //   this.disputeForm["product_id"]
    // ) {
    //   console.log('opppopopopo');
    //   console.log(this.disputeForm);

    // //   this.utils.presentLoading("Please wait...");

    // //   try {
    // //     let res = await this.api
    // //       .post(
    // //         api_urls.order + this.order_id + api_urls.dispute,
    // //         this.disputeForm
    // //       )
    // //       .toPromise();
    // //     console.log(res);
    // //     this.openDispute(res.data.id);
    // //     this.utils.dismissLoading();
    // //   } catch (error) {
    // //     console.log(error);
    // //     this.utils.dismissLoading();
    // //   }
    // } 
    // //else {
    // //   this.utils.presentAlert("Alert", "Form data missing");
    // // }
  }

  openDispute(id) {
    this.nav.navigateForward(["dispute-details", { id: id }]);
  }

  validate() {}

  goBack() {
    this.nav.back();
  }
}
