import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { api_urls } from 'src/environments/environment';
import { NavController, Platform } from '@ionic/angular';
import { AppDataService } from 'src/app/services/app-data.service';

@Component({
  selector: 'app-dispute-details',
  templateUrl: './dispute-details.page.html',
  styleUrls: ['./dispute-details.page.scss'],
})
export class DisputeDetailsPage implements OnInit {


  dispute: any;
  conversation = [];
  dispute_id: any;
  message = '';
  appealForm = false;

  constructor(private utils: UtilsService,
    private api: ApiService,
    private route: ActivatedRoute,
    private nav: NavController,
    private platform: Platform,
    private data: AppDataService) {
    //   this.platform.backButton.subscribe(() => {
    //     utils.backButtonPress(window.location.pathname);
    //  });
       // this.route.params.subscribe(params => {
    //   console.log(params);
    //   if (params && params.id) {
    //     this.dispute_id = params.id;
    //   }
    // });
    
  }

  ngOnInit() {
    this.dispute_id = this.route.snapshot.queryParamMap.get('dispute');
    console.log(this.dispute_id);
    //  this.loadData();
  }

  ionViewWillEnter() {

    this.loadData();

  }

  async loadData() {

    this.utils.presentLoading('Please wait...');

    try {
      this.dispute = (await this.api.get(api_urls.disputeAct + this.dispute_id).toPromise())['data'];
      console.log(this.dispute);

      // this.conversation = (await this.api.get(api_urls.disputeAct + this.dispute_id + 'response ').toPromise())['data'];
      // console.log(this.conversation);

      this.utils.dismissLoading();

    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);

    }

  }



  async sendMessage() {

    this.utils.presentLoading('Sending...');

    try {


      let res = await this.api.post(api_urls.disputeAct + this.dispute_id + '/response ', { reply: this.message, status: 1 }).toPromise();
      console.log(res);

      this.dispute = res.data;
      this.utils.dismissLoading();
      this.message = '';

    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
      this.message = '';

    }
  }

  goBack() {
    this.nav.back();
  }


  contactSeller() {
    this.data.order = { id: this.dispute.id };
    this.nav.navigateForward(['response']);
  }

  openShop(slug) {
    this.nav.navigateForward(['shop', { slugx: slug }]);
  }

  appeal() {

    this.appealForm = (this.appealForm) ? false : true;

  }

 async markSolved(){

    this.utils.presentLoading('Sending...');

    try {


      let res = await this.api.post(api_urls.disputeAct + this.dispute_id + '/solved',{_method:'PUT'}).toPromise();
      console.log(res);
      this.utils.dismissLoading();
      this.loadData();

    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
      this.message = '';

    }

  }

  async submitAppeal() {


    this.utils.presentLoading('Sending...');

    try {


      let res = await this.api.post(api_urls.disputeAct + this.dispute_id + '/appeal', { reply: this.message }).toPromise();
      console.log(res);

      this.dispute = res.data;
      this.utils.dismissLoading();
      this.message = '';
      this.appealForm = false;

    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
      this.message = '';

    }

  }
}
