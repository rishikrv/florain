import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { ApiService } from "src/app/services/api.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-shipping",
  templateUrl: "./shipping.page.html",
  styleUrls: ["./shipping.page.scss"],
})
export class ShippingPage implements OnInit {
  country_id: any;
  product_id: any;
  options: any;
  option: any;
  countries: any;
  constructor(
    private modal: ModalController,
    private params: NavParams,
    private api: ApiService,
    private utils: UtilsService
  ) {
    this.country_id = params.get("country");
    this.product_id = params.get("product");
    this.options = params.get("options");
    this.option = params.get("option");
    this.countries = params.get("countries");
  }

  ngOnInit() {}

  selectCountry() {
    console.log(this.country_id);
    this.loadOptions();
  }

  async loadOptions() {
    try {
      this.utils.presentLoading("");
      let res = await this.api
        .post(`listing/${this.product_id}/shipTo`, {
          ship_to: this.country_id.key,
        })
        .toPromise();
      console.log(res);
      this.options = res["shipping_options"];
      this.option = this.options[0];

      this.utils.dismissLoading();
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
    }
  }

  compareFn(e1, e2): boolean {
    return e1 && e2 ? e1.key == e2.key : e1 == e2;
  }

  close() {
    let data = {
      option: this.option,
      country: this.country_id,
      options: this.options,
    };
    console.log(data);

    this.modal.dismiss(data);
  }

  save() {
    let data = {
      option: this.option,
      country: this.country_id,
      options: this.options,
    };
    console.log("sending this data to product page");
    console.log(data);

    this.modal.dismiss(data);
  }
}
