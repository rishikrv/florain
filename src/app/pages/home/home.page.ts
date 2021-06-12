import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { IonSlides, NavController, Platform } from "@ionic/angular";
import { api_urls } from "../../../environments/environment";
import { ApiService } from "src/app/services/api.service";
import { UtilsService } from "src/app/services/utils.service";
import { CartService } from "src/app/services/cart.service";
import { AppDataService } from "src/app/services/app-data.service";
import { Network } from "@ionic-native/network/ngx";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  slideOpts = {
    effect: "flip",
    speed: 1000,
    initialSlide: 1,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };
  bannerOpts = {
    initialSlide: 1,
    speed: 1000,
  };
  sections = [true, false, false];
  @ViewChild("slider", { static: true }) slide: IonSlides;

  mainSlides = [];
  categories = [];
  banners = [];
  trendingProducts = [];
  recentProducts = [];
  popularProducts = [];
  additionalProducts = [];
  searchMoreMeta: any;

  hasNetwork: boolean;

  sliderProductList;

  categorySlug;

  constructor(
    private platform: Platform,
    private api: ApiService,
    private router: Router,
    private utils: UtilsService,
    private nav: NavController,
    private cart: CartService,
    private appData: AppDataService,
    private network: Network
  ) {
    this.hasNetwork = true;
    console.log(window.location.pathname);
    // this.platform.backButton.subscribe(() => {
    //    utils.backButtonPress(window.location.pathname);
    // });
  }

  ngOnInit() {
    if (this.network.type == this.network.Connection.NONE) {
      this.hasNetwork = false;
      this.utils.presentToast(
        "Unable to connect to internect. Please check your internet connection and try again."
      );
      // watch network for a connection
      this.network.onConnect().subscribe(() => {
        this.hasNetwork = true;
        console.log("network connected!");
        this.loadData();
      });
    } else {
      this.hasNetwork = true;
      this.loadData();
      this.network.onDisconnect().subscribe(() => {
        console.log("network was disconnected :-(");
        this.utils.presentToast("Network was disconnected");
        this.hasNetwork = false;
      });
    }
  }
  ionViewDidEnter() {
    this.cart.loadCart();
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
  nextSlide() {
    this.slide.slideNext();
  }

  prevSlide() {
    this.slide.slidePrev();
  }

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }
  slidesDidLoad1(slides: IonSlides) {
    slides.startAutoplay();
  }

  openProduct(slug) {
    this.router.navigate(["/product"], { queryParams: { slug: slug } });
  }


  // slider click event
  sliderClickEvent(link) {   

    if(link){
      var res = link.split("/");

      if (res[1]){
        if(res[1] == "category"){ 
          if(res[2]){
            this.router.navigateByUrl('list/' + res[2]);
          }
        } else if (res[1] == "product"){
          if(res[2]){
            this.router.navigate(["/product"], { queryParams: { slug: res[2] } });
          }
        } else if (res[1] == "categorygrp"){
          if(res[2]){
            this.categorySlug = this.categories.filter(
              (item) => item.slug === res[2]
            );
    
            this.appData.category = this.categorySlug[0]
            this.nav.navigateForward(["category"]);
          }
        } else if (res[1] == "page"){
          if(res[2]){
            this.nav.navigateForward([res[2]]);
          }
        } else {
          console.log('false');
        }
      }
    }
  }
  // slider click event end

  //banner click event
  openLinkBanner(link){
    // console.log(link);
    if(link){
      var res = link.split("/");
      // console.log(res);
      if (res[3]){
        if(res[3] == "category"){           
          if(res[4]){
            this.router.navigateByUrl('list/' + res[4]);
          }
        } else if (res[3] == "product"){
          if(res[4]){
            this.router.navigate(["/product"], { queryParams: { slug: res[4] } });
          }
        } else if (res[3] == "categorygrp"){
          if(res[4]){
            this.categorySlug = this.categories.filter(
              (item) => item.slug === res[4]
            );
    
            this.appData.category = this.categorySlug[0]
            this.nav.navigateForward(["category"]);
          }
        } else if (res[4] == "page"){
          if(res[4]){
            this.nav.navigateForward([res[4]]);
          }
        } else {
          console.log('false');
        }
      }
    }
  }

  async loadData() {
    console.log('device is: ', this.appData.playerID);
    
    try {
      this.utils.presentLoading("Please wait");
      this.mainSlides = (await this.api.get(api_urls.sliders).toPromise())[
        "data"
      ];
      
      
      this.categories = (await this.api.get(api_urls.grps).toPromise())["data"];
      let tempBanners = (await this.api.get(api_urls.banners).toPromise())[
        "data"
      ];
      console.log(tempBanners);

      this.banners[0] = tempBanners.filter(
        (item) => item.group_id === "group_1"
      );
      console.log(this.banners[0]);
      
      this.banners[1] = tempBanners.filter(
        (item) => item.group_id === "group_2"
      );
      this.banners[2] = tempBanners.filter(
        (item) => item.group_id === "group_3"
      );

      this.banners[3] = tempBanners.filter(
        (item) => item.group_id === "group_4"
      );
      this.banners[4] = tempBanners.filter(
        (item) => item.group_id === "group_5"
      );
      this.banners[5] = tempBanners.filter(
        (item) => item.group_id === "group_6"
      );

      this.utils.dismissLoading();

      this.trendingProducts = (
        await this.api.get(api_urls.lst_trend).toPromise()
      )["data"];
      this.recentProducts = (
        await this.api.get(api_urls.lst_latst).toPromise()
      )["data"];

      this.popularProducts = (await this.api.get(api_urls.lst_pop).toPromise())[
        "data"
      ];

      this.searchMoreMeta = await this.api.get(api_urls.lst_rand).toPromise();
      this.additionalProducts = this.searchMoreMeta.data;
    } catch (error) {
      console.log(error);
      this.utils.dismissLoading();
      this.utils.presentToast("Something went wrong. Please reload again");
    }
  }

  // async openLink(link) {
  //   console.log("clicked");
  //   console.log(link);
  //   let res = await this.api.get_full(link).toPromise();
  //   console.log(res);
  // }

  openCategories() {
    this.appData.setData("categories", this.categories);
    // this.nav.navigateForward(["categories"]);
    this.utils.presentLoading("Please wait");
    this.router.navigateByUrl('/categories');
  }

  async doRefresh(event) {
    try {
      this.mainSlides = (await this.api.get(api_urls.sliders).toPromise())[
        "data"
      ];
      this.categories = (await this.api.get(api_urls.grps).toPromise())["data"];
      let tempBanners = (await this.api.get(api_urls.banners).toPromise())[
        "data"
      ];
      console.log(tempBanners);

      this.banners[0] = tempBanners.filter(
        (item) => item.group_id === "best_deals"
      );
      this.banners[1] = tempBanners.filter(
        (item) => item.group_id === "place_one"
      );
      this.banners[2] = tempBanners.filter(
        (item) => item.group_id === "place_two"
      );

      this.banners[3] = tempBanners.filter(
        (item) => item.group_id === "place_three"
      );
      this.banners[4] = tempBanners.filter(
        (item) => item.group_id === "sidebar"
      );

      event.target.complete();

      this.trendingProducts = (
        await this.api.get(api_urls.lst_trend).toPromise()
      )["data"];
      this.recentProducts = (
        await this.api.get(api_urls.lst_latst).toPromise()
      )["data"];

      this.popularProducts = (await this.api.get(api_urls.lst_pop).toPromise())[
        "data"
      ];

      this.searchMoreMeta = await this.api.get(api_urls.lst_rand).toPromise();
      this.additionalProducts = this.searchMoreMeta.data;
    } catch (error) {
      console.log(error);

      this.utils.presentToast("Something went wrong. Please reload again");
    }
  }

  async loadMoreProducts(link, event?) {
    if (link) {
      this.searchMoreMeta = await this.api.get_full(link).toPromise();
      this.additionalProducts = this.additionalProducts.concat(
        this.searchMoreMeta.data
      );
    }

    if (event) {
      event.target.complete();
    }
  }

  openCategory(cat) {
    this.appData.category = cat;
    this.nav.navigateForward(["category"]);
  }

  openSearch() {
    this.nav.navigateForward(["search"]);
  }

  addToCart(product) {
    let data = {
      quantity: 1,
    };

    console.log(data);
    this.cart.addToCart(product.slug, data);
  }
}
