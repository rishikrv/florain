import { Component, OnInit, ViewChild } from "@angular/core";
import { NavController, ModalController, IonSlides, Platform } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../environments/environment.prod";
import { api_urls } from "../../../environments/environment";
import { BehaviorSubject } from "rxjs";
import { CartService } from "src/app/services/cart.service";
import { ApiService } from "src/app/services/api.service";
import { UtilsService } from "src/app/services/utils.service";
import { AppDataService } from "src/app/services/app-data.service";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { ShippingPage } from "../shipping/shipping.page";
import { LoginPage } from "../login/login.page";
@Component({
  selector: "app-product",
  templateUrl: "./product.page.html",
  styleUrls: ["./product.page.scss"],
})
export class ProductPage implements OnInit {
  sections = [true, false, false];
  precat: any;
  variants: any;
  countries: any;
  shipping_options: any;
  shipping_country_id: any;
  option: any;
  country: any;
  isValid = true;

  slideOpts = {
    effect: "flip",
  };

  @ViewChild("slides", { static: false }) slides: IonSlides;
  selected = 1;
  product: any;
  features = "features";
  descriptions = "product";
  qty = 1;
  cartItemCount: BehaviorSubject<number>;
  feedbacks = [];

  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;

  attributes: [];

  customPopoverOptions: any;

  constructor(
    private nav: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private cart: CartService,
    private platform: Platform,
    private api: ApiService,
    private utils: UtilsService,
    private data: AppDataService,
    private socialShare: SocialSharing,
    public modalController: ModalController
  ) {
    this.attributes = [];
    // console.log(window.location.pathname);
    // this.platform.backButton.subscribe(() => {
    //    utils.backButtonPress(window.location.pathname);
    // });

    
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params && params.slug) {
        this.loadData(params.slug);
      }
    });
  }

  handleAttribute(id, attribute) {
    let tmpAttribute = {};
    tmpAttribute[attribute.detail.value.key] = attribute.detail.value.value;
    this.variants.attributes[id].selected = true;
    this.variants.attributes[id].selectedValue = tmpAttribute;

    this.loadItemVariant(id);
  }

  async loadItemVariant(key) {
    let canLoadItemVariant = true;
    let data = { attributes: {} };

    Object.entries(this.variants.attributes).forEach((attribute) => {
      canLoadItemVariant = attribute[1]["selected"];
      console.log(attribute);

      data.attributes = {
        ...data.attributes,
        ...attribute[1]["selectedValue"],
      };
    });

    console.log(data);

    if (canLoadItemVariant) {
      this.isValid = true;
      try {
        this.utils.presentLoading("");
        let res = await this.api
          .post(`variant/${this.product["slug"]}`, data)
          .toPromise();
        // console.log(Object.entries(res.data));
        if (res["data"]) {
          for (let [key, value] of Object.entries(res.data)) {
            this.product[key] = value;
          }
          this.startCounter();
          this.utils.dismissLoading();
          let index = this.variants.images.findIndex(
            (x) => x.id == this.product["image_id"]
          );
          console.log(index);
          if (index > -1) {
            this.slides.slideTo(index);
          }
        }
      } catch (error) {
        this.utils.dismissLoading();
        console.log(error);
        this.utils.presentToast(error.error.message);
      }
    }
  }

  startCounter() {
    // Set the date we're counting down to
    let countDownDate = new Date(this.product["offer_end"]).getTime();
    let startTime = new Date(this.product["offer_start"]).getTime();

    // Update the count down every 1 second
    let x = window.setInterval(() => {
      // Get today's date and time
      let now = new Date().getTime();

      if (now >= startTime) {
        // Find the distance between now and the count down date
        let distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
        this.hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"

        //console.log(this.seconds);

        // If the count down is over, write some text
        if ((distance = 0)) {
          clearInterval(x);
        }
      }
    }, 1000);
  }

  activate(category) {
    this.precat.active = false;
    category.active = true;
    this.precat = category;
  }

  addQty() {
    if (this.qty < this.product["stock_quantity"]) {
      ++this.qty;
    }
  }
  rmQty() {
    if (this.qty > 1) {
      --this.qty;
    }
  }

  changeSection(id) {
    if (id == 0) {
      this.sections[0] = true;
      this.sections[1] = false;
      this.sections[2] = false;
    } else if (id == 1) {
      this.sections[0] = false;
      this.sections[1] = true;
      this.sections[2] = false;
    } else if (id == 2) {
      this.sections[0] = false;
      this.sections[1] = false;
      this.sections[2] = true;
    }
  }

  ionViewDidEnter() {
    this.cartItemCount = this.cart.getCartItemCount();
  }

  async loadData(slug) {
    try {
      this.utils.presentLoading("Please wait...");
      let res = await this.api.get(api_urls.lst_sgl + slug).toPromise();

      console.log(res);

      this.variants = res["variants"];
      this.product = res["data"];
      this.countries = res["countries"];
      this.shipping_options = res["shipping_options"];
      this.shipping_country_id = res["shipping_country_id"];

      for (let [key, value] of Object.entries(this.variants.attributes)) {
        this.variants.attributes[key].selected = false;
        this.variants.attributes[key].selectedValue = {};
      }

      this.country = {
        key: this.shipping_country_id,
        value: this.countries[this.shipping_country_id],
      };
      this.option = this.shipping_options[0];

      this.utils.dismissLoading();
      this.startCounter();

      if (this.product["feedbacks"].length > 3) {
        this.feedbacks = this.product["feedbacks"].splice(3);
        console.log(this.feedbacks);
      }

      //set slide based on image id
      let index = this.variants.images.findIndex(
        (x) => x.id == this.product["image_id"]
      );
      console.log(index);

      // if (index > -1) {
      //   this.slides.slideTo(index);
      // }
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ShippingPage,
      componentProps: {
        countries: this.countries,
        options: this.shipping_options,
        country: this.country,
        option: this.option,
        product: this.product["id"],
      },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    console.log(data);

    this.option = data.option;
    this.country = data.country;
    this.shipping_options = data.options;
  }

  share() {
    this.socialShare.share(
      this.product["title"],
      "Product Info",
      this.variants["images"],
      environment.IMG_URL + "product/" + this.product["slug"]
    );
  }

  checkValidity(product) {
    let count = 0;
    console.log({ attributes: this.variants.attributes });

    if (Object.entries(this.variants.attributes).length > 0) {
      for (let [key, value] of Object.entries(this.variants.attributes)) {
        count++;
        if (!this.variants.attributes[key].selected) {
          this.isValid = false;
        }

        if (count == Object.entries(this.variants.attributes).length) {
          if (this.isValid) {
            this.addToCart(product);
          } else {
            this.utils.presentToast("Please chose item attributes");
          }
        }
      }
    } else {
      this.addToCart(product);
    }
  }

  addToCart(product) {
    let data = {
      ship_to: this.country.key,
      shipping_option_id: this.option.id,
      shipping_zone_id: this.option.shipping_zone_id,
      quantity: this.qty,
    };

    console.log(data);

    this.cart.addToCart(product.slug, data);
  }

  addToWishlist(product) {
    if (this.data.isAuthenticated.value) {
      this.cart.addToWishlist(product.slug);
    } else {
      this.login(product);
    }
  }

  async login(product) {
    const modal = await this.modalController.create({
      component: LoginPage,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
    if (data.isAuthenticated) {
      this.addToWishlist(product);
    }
  }

  openShop(slug) {
    // this.nav.navigateForward(["shop", { slugx: slug }]);
    this.router.navigate(["/shop"], { queryParams: { slugx: slug } });
  }

  goBack() {
    this.nav.back();
  }

  addToCartx(product) {
    this.cart.addToCart(product.slug, 1);
  }

  openReviews() {
    this.data.feedbacks = this.product["feedbacks"];
    this.nav.navigateForward(["reviews"]);
  }

  contactSeller() {
    if (this.data.isAuthenticated.value) {
      this.data.product = this.product;
      this.nav.navigateForward(["contact-seller"]);
    } else {
      this.sellerLogin();
    }
  }

  async sellerLogin() {
    const modal = await this.modalController.create({
      component: LoginPage,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
    if (data.isAuthenticated) {
      this.data.product = this.product;
      this.nav.navigateForward(["contact-seller"]);
    }
  }

  openOffers() {
    this.nav.navigateForward(["offer", { slug: this.product["product"].slug }]);
  }

  openMF() {
    this.nav.navigateForward([
      "manufacturer",
      { slug: this.product["product"].manufacturer.slug },
    ]);
  }

  openProduct(slug) {
    this.router.navigate(["/product"], { queryParams: { slug: slug } });
  }

  openCart() {
    this.nav.navigateRoot(["cart"]);
  }
}
