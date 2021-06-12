import { Component, OnInit } from "@angular/core";
import { UtilsService } from "src/app/services/utils.service";
import { ApiService } from "src/app/services/api.service";
import { api_urls } from "src/environments/environment";
import { NavController, Platform } from "@ionic/angular";
import { AppDataService } from "src/app/services/app-data.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-add-address",
  templateUrl: "./add-address.page.html",
  styleUrls: ["./add-address.page.scss"],
})
export class AddAddressPage implements OnInit {
  countries: any;
  states: any;
  address: any;
  isAuthenticated: BehaviorSubject<boolean>;
  submit = false;
  constructor(
    private platform: Platform,
    private utils: UtilsService,
    private api: ApiService,
    private nav: NavController,
    private data: AppDataService
  ) {
    this.address = { create_account: false, accepts_marketing: false };
    this.states = [];
    this.countries = [];
  //   this.platform.backButton.subscribe(() => {
  //     utils.backButtonPress(window.location.pathname);
  //  });
  }

  ngOnInit() {
    this.isAuthenticated = this.data.isAuthenticated;
    this.loadData();
  }

  compareWithFn = (o1, o2) => {
    return o1 === o2;
  };

  async loadData() {
    try {
      console.log("loading countries");

      this.countries = (await this.api.get(api_urls.county).toPromise())[
        "data"
      ];

      if (this.data.order.ship_to) {
        this.address["country_id"] = this.data.order.ship_to;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getStates(event) {
    console.log(event);

    if (event.detail.value) {
      try {
        this.states = (
          await this.api.get(api_urls.state + event.detail.value).toPromise()
        )["data"];
        console.log(this.states);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async addAddress() {
    try {
      this.utils.presentLoading("Please wait...");
      let res = await this.api
        .post(api_urls.add_store, this.address)
        .toPromise();
      console.log(res);
      this.utils.dismissLoading();
      this.goBack();
    } catch (error) {
      console.log(error);
      this.utils.dismissLoading();
      this.utils.presentToast(error.error.message);
    }
  }

  goBack() {
    this.nav.back();
  }

  saveGuestAddress() {
    this.data.guest_adddress = this.address;
    this.nav.back();
  }

  validateForm() {
    this.submit = true;

    if (
      this.address["address_type"] &&
      this.address["address_title"] &&
      this.address["phone"] &&
      this.address["country_id"] &&
      this.address["zip_code"] &&
      this.address["address_line_1"] &&
      this.address["zip_code"] &&
      this.address["city"]
    ) {
      this.addAddress();
    } else {
      //this.utils.presentAlert('Warning', 'Please input complete data');
    }
  }

  validateGuestForm() {
    this.submit = true;
    if (
      this.address["address_title"] &&
      this.address["phone"] &&
      this.address["country_id"] &&
      this.address["zip_code"] &&
      this.address["address_line_1"] &&
      this.address["zip_code"] &&
      this.address["city"] &&
      this.address["email"] &&
      this.validateEmail(this.address["email"]) &&
      !this.address["create_account"]
    ) {
      this.saveGuestAddress();
    } else {
      if (
        this.address["address_title"] &&
        this.address["phone"] &&
        this.address["country_id"] &&
        this.address["zip_code"] &&
        this.address["address_line_1"] &&
        this.address["zip_code"] &&
        this.address["city"] &&
        this.address["email"] &&
        this.validateEmail(this.address["email"]) &&
        this.address["create_account"] &&
        this.address["password"] &&
        this.address["accepts_marketing"]
      ) {
        if (this.address["password"] == this.address["password_confirmation"]) {
          this.saveGuestAddress();
        } else {
          this.utils.presentAlert("Warning", "password does not match");
        }
      } else {
        this.utils.presentAlert("Warning", "Invalid address");
      }
    }
  }

  validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
