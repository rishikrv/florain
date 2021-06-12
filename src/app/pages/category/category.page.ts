import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { api_urls } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { AppDataService } from 'src/app/services/app-data.service';
import { CartService } from 'src/app/services/cart.service';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {



  category: any;
  categories = [];
  subCategories = [];
  products = [];
  prevCat: any;
  productsMeta: any;
  constructor(private api: ApiService,
    private utils: UtilsService,
    private nav: NavController,
    private platform: Platform,
    private appData: AppDataService,
    private router: Router,
    private cart: CartService) { 
      // console.log(window.location.pathname);
      // this.platform.backButton.subscribe(() => {
      //   utils.backButtonPress(window.location.pathname);
      // });
    //   this.platform.backButton.subscribe(() => {
    //     utils.backButtonPress(window.location.pathname);
    //  });
    }

  ngOnInit() {
    console.log('this is categor page');
    
    this.category = this.appData.category;
    console.log(this.appData.category);
    this.loadData();
  }



  async loadData() {
    this.utils.presentLoading('Please wait..');

    try {
      this.categories = (await this.api.get(api_urls.subgrps + "/" + this.category.id).toPromise())['data'];
      this.productsMeta = (await this.api.get(`listing/category-grp/${this.category.slug}`).toPromise());

      let count = 0;
      this.categories.forEach(cat => {
        this.categories[count].active = false;
        ++count;
      });

      this.products = this.productsMeta['data'];
      this.utils.dismissLoading();

    } catch (error) {
      console.log(error);
      this.utils.dismissLoading();

      if (error.status == 404) {
        this.products = [];
        this.utils.presentToast(error.error.error);
      }

    }

  }

  async selectCategory(catey, type) {


    // determine whether is category or subcategory

    if (type == 'category') {

      this.prevCat = catey;
      // if category is already open then unselect it
      if (catey.active == true || catey.active) {

        let index = this.categories.findIndex(x => x.id == catey.id);
        this.categories[index].active = false;
        this.prevCat = null;
        this.loadData();
        this.subCategories=[];
        return;
      }

      let count = 0;
      this.categories.forEach(cat => {
        this.categories[count].active = false;
        ++count;

        if (count == this.categories.length) {

          let index = this.categories.findIndex(x => x.id == catey.id);
          this.categories[index].active = true;
          this.loadSubData(catey, type);
        }
      });


    }
    else {

      // if type == subCategory

      // if Subcategory is already open then unselect it
      if (catey.active == true || catey.active) {

        let index = this.subCategories.findIndex(x => x.id == catey.id);
        this.subCategories[index].active = false;
        this.loadSubData(this.prevCat, 'category');
        return;
      }

      let count = 0;
      this.subCategories.forEach(cat => {
        this.subCategories[count].active = false;
        ++count;

        if (count == this.subCategories.length) {

          let index = this.subCategories.findIndex(x => x.id == catey.id);
          this.subCategories[index].active = true;
          this.loadSubData(catey, type);
        }
      });

    }

  }


  async loadSubData(catey, type) {

    this.utils.presentLoading('Please wait..');

    try {

      if (type == 'category') {
        this.productsMeta = (await this.api.get(`listing/category-subgrp/${catey.slug}`).toPromise());
        this.products = this.productsMeta['data'];
        this.subCategories = (await this.api.get('categories/' + catey.id).toPromise())['data'];


        let count = 0;
        this.subCategories.forEach(cat => {
          this.subCategories[count].active = false;
          ++count;
        });

      }else{

        this.productsMeta = (await this.api.get(`listing/category/${catey.slug}`).toPromise());
        this.products = this.productsMeta['data'];        


      }

      this.utils.dismissLoading();

    } catch (error) {
      console.log(error);
      this.utils.dismissLoading();

      if (error.status == 404) {
        this.products = [];
        this.utils.presentToast(error.error.error);
      }

    }

  }

  async loadMoreProducts(link, event?) {

    if (link) {
      this.productsMeta = (await this.api.get_full(link).toPromise());
      this.products = this.products.concat(this.productsMeta.data);
    }

    if (event) {
      event.target.complete();
    }

  }


  goBack() {
    this.nav.back();
  }

  addToCart(product) {
    
    let data={
      quantity:  1
    }

    console.log(data);
    this.cart.addToCart(product.slug, data);
  }



  openProduct(slug) {
    this.router.navigate(['/product'], { queryParams: { slug: slug } });
  }

}
