import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";

@Component({
  selector: "app-menuf-details",
  templateUrl: "./menuf-details.page.html",
  styleUrls: ["./menuf-details.page.scss"],
})
export class MenufDetailsPage implements OnInit {
  shop: any;
  constructor(public params: NavParams, public model: ModalController) {
    this.shop = params.get("shop");
    console.log(this.shop);
  }

  ngOnInit() {}

  goBack() {
    this.model.dismiss();
  }
}
