import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { UtilsService } from "src/app/services/utils.service";
import { api_urls } from "src/environments/environment";
import { AppDataService } from "src/app/services/app-data.service";
import { async } from "@angular/core/testing";
import { NavController, Platform } from "@ionic/angular";

@Component({
  selector: "app-evaluate",
  templateUrl: "./evaluate.page.html",
  styleUrls: ["./evaluate.page.scss"],
})
export class EvaluatePage implements OnInit {
  seller = { rating: 0, comment: "" };
  items: Array<{
    id: number;
    comment: string;
    rating: number;
    feedback: any;
  }> = [];

  order_id: any;
  order: any;
  shop: any;
  stars = [];
  sellerStars = [false, false, false, false, false];

  constructor(
    private platform: Platform,
    private api: ApiService,
    private utils: UtilsService,
    private data: AppDataService,
    private nav: NavController
  ) {
  //   this.platform.backButton.subscribe(() => {
  //     utils.backButtonPress(window.location.pathname);
  //  });
  }

  goBack(){
    this.nav.back();
  }

  ngOnInit() {
    this.order_id = this.data.order.id;
    this.loadData();
  }

  fill(id, itemId) {
    this.stars[itemId][id] = this.stars[itemId][id] ? false : true;
    this.stars[itemId].forEach((star, index) => {
      this.stars[itemId][index] = false;
      if (index <= id) {
        this.stars[itemId][index] = true;
      }
    });

    this.items[itemId].rating = id + 1;
    console.log(this.items[itemId]);
  }

  rateSeller(id) {
    this.sellerStars[id] = this.sellerStars[id] ? false : true;

    this.sellerStars.forEach((star, index) => {
      this.sellerStars[index] = false;
      if (index <= id) {
        this.sellerStars[index] = true;
      }
    });

    // console.log(this.sellerStars);
    this.seller.rating = id + 1;
    console.log("Seller Rating" + (id + 1));
  }

  async loadData() {
    // console.log(this.data.data);
    console.log(this.data.order);
  
    
    this.utils.presentLoading("Please wait...");

    try {
      this.order = (
        await this.api.get(api_urls.order + this.order_id).toPromise()
      )["data"];

      // var shopFeedback = await this.api.get(api_urls.shop + this.data.order.shop.id + api_urls.lst_latst).toPromise();

      // console.log(shopFeedback);
      

      console.log(this.order);

      this.shop = this.order.shop;

      console.log(this.order);
      

      this.order.items.forEach((item) => {
        this.items.push({
          id: item.id,
          comment: "",
          rating: 0,
          feedback: item.feedback,
        });
        this.stars.push([false, false, false, false, false]);
      });

      this.utils.dismissLoading();
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
    }
  }

  // async loadData(){

  //   this.utils.presentLoading('');

  //   try {

  //     this.order = await this.api.post(api_urls.shop+ this.shop.id +api_urls.feedback,{}).toPromise();
  //     console.log(res);

  //     this.utils.dismissLoading();

  //   } catch (error) {

  //     console.log(error);
  //     this.utils.dismissLoading();
  //     this.utils.presentAlert('Error','Something went wrong!');
  //   }
  // }

  submitFeedback() {
    console.log(this.seller);
    console.log(this.items);
    let data = [];
    let count = 0;
    this.items.forEach(async (element) => {
      console.log("feedbak:", element.feedback);
      
      if (!element.feedback) {
        data[element.id] = { rating: element.rating, comment: element.comment };
        console.log("data of items: ", data);
      }
      ++count;

      console.log("lenght: ", this.items.length);
      console.log("count: ", count);
      
      if (count == this.items.length) {
        console.log(data);

        try {
          if (!this.shop.feedback) {
            if (this.seller.comment.length < 10) {
              this.utils.presentToast("Seller Feedback comment must be at least 10 characters.");
              return;
            }
            
            console.log('This is shop feedback');
            console.log(this.shop.id);
            

            this.utils.presentLoading("");

            let res = await this.api
              .post(api_urls.shop + this.order_id + api_urls.feedback,
                {
                  rating : this.seller.rating,
                  comment : this.seller.comment
                }).toPromise();
            console.log(res);
            console.log('shop feed back done');
            
            this.utils.presentToast(
              res.message || "Feedback Submitted Successfully"
            );
          }

          let res2 = await this.api
            .post(api_urls.order + this.order.id + api_urls.feedback, data)
            .toPromise();
          console.log(res2);

          this.utils.dismissLoading();
          this.utils.presentToast(
            res2.message || "Feedback Submitted Successfully"
          );
          // this.nav.back();

          console.log('this is product feedback');
          

        } catch (error) {
          console.log(error);
          this.utils.dismissLoading();
          //this.utils.presentAlert('Error', error.error.message);
          this.utils.presentToast("Something went wrong. Try again");
        }
      }
    });
  }
}
