import { Component, OnInit, ViewChild } from "@angular/core";
import { UtilsService } from "src/app/services/utils.service";
import { ApiService } from "src/app/services/api.service";
import { api_urls } from "src/environments/environment";
import { AppDataService } from "src/app/services/app-data.service";
import { NavController, ModalController, IonSlides, Platform } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
import { LoginPage } from "../login/login.page";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.page.html",
  styleUrls: ["./checkout.page.scss"],
})
export class CheckoutPage implements OnInit {
  addresses = [];
  paymentOps = [];
  packagingOps = [];
  order: any;

  selectedAddress: any;
  selectedGuestAddress: any;
  selectedPayment: any;
  selectedPackaging: any;
  selectedShippingOption: any;

  buyer_note = "";
  ship_to: any;
  shipping_options = [];
  shipping_address: any;
  coupon: any;

  loading_addresses = false;
  loading_paymentOps = false;
  loading_packagingOps = false;

  isAuthenticated: BehaviorSubject<boolean>;

  // access to slider
  progress = 0;
  currentSlide = 0;
  @ViewChild("slideWithNav", { static: false }) slideWithNav: IonSlides;

  constructor(
    public utils: UtilsService,
    public api: ApiService,
    public appData: AppDataService,
    public nav: NavController,
    private platform: Platform,
    public modalController: ModalController
  ) {
    console.log(window.location.pathname);
      // this.platform.backButton.subscribe(() => {
      //   utils.backButtonPress(window.location.pathname);
      // });
  }

  ngOnInit() {
    this.isAuthenticated = this.appData.isAuthenticated;
    this.order = this.appData.order;
    console.log(`User login status: ${this.isAuthenticated.value}`);
  }
  ionViewWillEnter() {
    if (this.isAuthenticated.value === true) {
      this.getCustomerAddresses();
    } else {
      this.getGuestAddress();
    }
  }

  // ionViewDidLeave() {
  //   if (!this.isAuthenticated.value) {
  //     this.appData.guest_adddress = null;
  //   }
  // }

  /**
   * loads all addresses based on customer id
   */
  async getCustomerAddresses() {
    try {
      this.loading_addresses = true;
      console.log("loading addresses");
      this.addresses = (await this.api.get(api_urls.addresses).toPromise())[
        "data"
      ];
      console.log(this.addresses);
      this.loading_addresses = false;
    } catch (error) {
      console.log(error);
      this.loading_addresses = false;
    }
  }

  getGuestAddress() {
    if (
      this.appData.guest_adddress !== null &&
      this.appData.guest_adddress !== undefined
    ) {
      this.selectedGuestAddress = this.appData.guest_adddress;
      this.appData.guest_adddress = null;
    }
  }

  /**
   * selects customer address
   * @param event
   */
  selectAddress(event) {
    let address = event.detail.value;
    this.selectedAddress = address;
    this.ship_to = address.id;
  }

  /**
   * Confirms shipping
   */

  confirmShipping() {
    if (this.isAuthenticated.value === true) {
      if (this.selectedAddress === undefined || this.selectedAddress === null) {
        this.utils.presentToast("Please select or enter new address");
      } else {
        this.progress = 50;
        setTimeout(() => {
          this.swipeToSlide(1);
        }, 500);

        this.getShippingOptions();
        this.getOrderOptions();
      }
    } else {
      if (
        this.selectedGuestAddress === undefined ||
        this.selectedGuestAddress === null
      ) {
        this.utils.presentToast("Please select or enter new address");
      } else {
        this.progress = 50;
        setTimeout(() => {
          this.swipeToSlide(1);
        }, 100);

        this.getGuestAddressShippingOptions();
        this.getOrderOptions();
      }
    }
  }

  async getGuestAddressShippingOptions() {
    this.utils.presentLoading("");

    try {
      let res = await this.api
        .post(
          api_urls.cartUpdate + this.order.id + "/shipTo",
          this.selectedGuestAddress
        )
        .toPromise();

      this.utils.dismissLoading();

      if (res) {
        this.order = res.cart;
        this.shipping_options = res.shipping_options;
        this.selectedAddress = { id: this.order.ship_to };
        this.shipping_address = res.shipping_address;
      }
    } catch (error) {
      this.utils.dismissLoading();
    }
  }

  async getShippingOptions() {
    this.loading_addresses = true;
    let address = this.selectedAddress;

    try {
      let res = await this.api
        .post(api_urls.cartUpdate + this.order.id + api_urls.shipping, {
          ship_to: address.id,
          address_id: address.id,
          country_id: address.country.id,
        })
        .toPromise();

      this.shipping_options = res.shipping_options;
      this.shipping_address = res.shipping_address;
      this.order = res.cart;

      this.loading_addresses = false;
    } catch (error) {
      this.loading_addresses = false;
      console.log(error);
    }
  }

  /**
   * gets payment and packaging options
   */

  async getOrderOptions() {
    try {
      this.loading_packagingOps = true;
      console.log("loading packing options");
      this.packagingOps = await this.api
        .get(api_urls.packaging + this.order.shop.slug)
        .toPromise();
      console.log(this.packagingOps);
      this.loading_packagingOps = false;

      this.loading_paymentOps = true;
      console.log("loading payment options");
      this.paymentOps = (
        await this.api.get(api_urls.payOps + this.order.shop.slug).toPromise()
      )["data"];
      console.log(this.paymentOps);
      this.loading_paymentOps = false;
    } catch (error) {
      console.log(error);
      this.utils.presentToast(error.error.message);
      this.loading_paymentOps = false;
      this.loading_packagingOps = false;
    }
  }

  /**
   *
   * handles shipping option change
   */

  onShippingOptionChange(event) {
    console.log(event);
    this.selectedShippingOption = event.detail.value;
    this.updateShippingOption();
  }

  /**
   * updates shipping option
   *
   */

  async updateShippingOption() {
    console.log(this.selectedShippingOption);

    this.utils.presentLoading("");
    let data = {
      shipping_zone_id: this.selectedShippingOption.shipping_zone_id,
      shipping_option_id: this.selectedShippingOption.id,
      _method: "PUT",
    };

    try {
      let res = await this.api
        .post(api_urls.cartUpdate + this.order.id + "/update", data)
        .toPromise();

      if (res.cart) {
        this.order = res.cart;
      }

      this.utils.dismissLoading();
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
    }
  }

  /**
   * handles packaging option change
   * @param $event
   */
  onPackagingOptionChange(event) {
    this.selectedPackaging = event.detail.value;
    this.updatePackagingOption();
  }

  /**
   * updates packaging options
   */
  async updatePackagingOption() {
    this.utils.presentLoading("");

    try {
      let res = await this.api
        .post(api_urls.cartUpdate + this.order.id + "/update", {
          packaging_id: this.selectedPackaging.id,
          _method: "PUT",
        })
        .toPromise();
      console.log(res);

      if (res.cart) {
        this.order = res.cart;
      }
      this.utils.dismissLoading();
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
    }
  }

  /**
   * handles payment option change
   */
  onPaymentOptionChange(event) {
    this.selectedPayment = event.detail.value;
  }

  /**
   * confirms Order options
   */

  confirmOrderOptions() {
    if (
      this.selectedShippingOption === null ||
      this.selectedShippingOption === undefined
    ) {
      this.utils.presentToast("Please select shipping option");
    } else if (
      this.selectedPayment === null ||
      this.selectedPayment === undefined
    ) {
      this.utils.presentToast("Please select payment option");
    } else if (
      this.selectedPackaging === null ||
      this.selectedPackaging === undefined
    ) {
      this.utils.presentToast("Please select packaging option");
    } else {
      this.progress = 100;
      setTimeout(() => {
        this.swipeToSlide(2);
      }, 500);
    }
  }

  addAddress() {
    this.nav.navigateForward(["add-address"]);
  }

  /**
   * Confirms place order
   */
  async placeOrder() {
    let data = {
      shipping_address: this.shipping_address,
      ship_to: this.selectedAddress.id,
      address_id: this.selectedAddress.id,
      payment_method_id: this.selectedPayment.id,
      shipping_option_id: this.selectedShippingOption.id,
      packaging_id: this.selectedPackaging.id,
      buyer_note: this.buyer_note,
      device_id: this.appData.playerID,
    };

    console.log(`Order Data =>  ${JSON.stringify(data)}`);

    this.utils.presentLoading("Please wait");

    try {
      let res = await this.api
        .post(api_urls.cartUpdate + this.order.id + "/checkout", data)
        .toPromise();
      console.log(res);

      if (res.data) {
        this.utils.presentToast("Order Placed Successfully!");
        this.nav.navigateRoot("/");
      }

      this.utils.dismissLoading();
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
    }
  }

  /**
   * handles slide change event
   */
  async onSlideChanged(event) {
    this.currentSlide = await this.slideWithNav.getActiveIndex();
    console.log(`current slide : ${this.currentSlide}`);
  }
  swipeToSlide(id) {
    this.slideWithNav.slideTo(id);
  }

  async login() {
    if (this.isAuthenticated.value) {
      this.applyCoupon();
    } else {
      const modal = await this.modalController.create({
        component: LoginPage,
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();
      console.log(data);
      if (data.isAuthenticated) {
        this.isAuthenticated.next(data.isAuthenticated);
        this.applyCoupon();
      }
    }
  }

  async applyCoupon() {
    this.utils.presentLoading("");

    try {
      let res = await this.api
        .post(api_urls.cartUpdate + this.order.id + "/applyCoupon", {
          coupon: this.coupon,
        })
        .toPromise();
      console.log(res);

      if (res.cart) {
        this.order = res.cart;
        this.utils.presentToast(res.message);
      }

      this.utils.dismissLoading();
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
      this.utils.presentToast(error.error.message);
    }
  }

  goBack() {
    this.nav.back();
  }
}
