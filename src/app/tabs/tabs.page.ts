import { Component } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CartService } from "../services/cart.service";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
})
export class TabsPage {
  cartItemCount: BehaviorSubject<number>;
  processing = false;

  constructor(private cartService: CartService) {
    this.cartItemCount = cartService.getCartItemCount();
  }
}
