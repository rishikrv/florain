import { Component, OnInit } from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";

@Component({
  selector: "app-shop-details",
  templateUrl: "./shop-details.page.html",
  styleUrls: ["./shop-details.page.scss"],
})
export class ShopDetailsPage implements OnInit {
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
