import { Component, OnInit } from "@angular/core";
import { UtilsService } from "src/app/services/utils.service";
import { ApiService } from "src/app/services/api.service";
import { api_urls } from "src/environments/environment";
import { NavController, Platform } from "@ionic/angular";

@Component({
  selector: "app-account-details",
  templateUrl: "./account-details.page.html",
  styleUrls: ["./account-details.page.scss"],
})
export class AccountDetailsPage implements OnInit {
  accountDetails: any;
  addresses: any;
  password: any;

  constructor(
    private uitls: UtilsService,
    private api: ApiService,
    private platform: Platform,
    private utils: UtilsService,
    private nav: NavController
  ) {
    this.accountDetails = {};
    this.addresses = [];
    this.password = {};
  //   this.platform.backButton.subscribe(() => {
  //     utils.backButtonPress(window.location.pathname);
  //  });
  }

  ngOnInit() {
    this.loadData();
    // init data
    this.password = {
      current_password: "",
      password: "",
      password_confirmation: "",
    };
  }

  ionViewWillEnter() {
    this.loadData();
  }

  async loadData() {
    this.uitls.presentLoading("Please wait...");
    try {
      let res1 = await this.api.get(api_urls.my_acc).toPromise();
      console.log(res1);
      this.accountDetails = res1.data;

      let res2 = await this.api.get(api_urls.addresses).toPromise();
      console.log(res2);
      this.addresses = res2.data;

      this.uitls.dismissLoading();
    } catch (error) {
      console.log(error);
      this.uitls.dismissLoading();
    }
  }

  async updateBasicInfo() {
    this.uitls.presentLoading("updating...");
    this.accountDetails["_method"] = "PUT";
    try {
      let res = await this.api
        .post(api_urls.acc_updt, this.accountDetails)
        .toPromise();
      console.log(res);
      this.uitls.dismissLoading();
    } catch (error) {
      console.log(error);
      this.uitls.dismissLoading();
    }
  }

  async updatePassword() {
    this.uitls.presentLoading("updating...");
    this.password["_method"] = "PUT";
    try {
      let res = await this.api
        .post(api_urls.pwd_updt, this.password)
        .toPromise();
      console.log(res);
      this.uitls.dismissLoading();
    } catch (error) {
      console.log(error);
      this.uitls.dismissLoading();
      this.uitls.presentAlert("Invalid Data", error.error.message);
    }
  }

  matchPassword() {
    if (
      this.password.current_password &&
      this.password.password_confirmation &&
      this.password.password_confirmation
    ) {
      if (this.password.password_confirmation === this.password.password) {
        this.updatePassword();
      } else {
        this.uitls.presentAlert("Error", "Password does not match");
      }
    } else {
      this.uitls.presentAlert("Missing Password", "Enter your password");
    }
  }

  addAddress() {
    this.nav.navigateForward(["add-address"]);
  }

  async removeAddress(address) {
    try {
      this.uitls.presentLoading("Please wait...");
      let res = await this.api
        .delete(`${api_urls.add_del}${address.id}`)
        .toPromise();
      console.log(res);
      this.addresses = res.data;
      this.uitls.dismissLoading();
    } catch (error) {
      console.log(error);
      this.uitls.dismissLoading();
    }
  }
}
