import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AppDataService } from 'src/app/services/app-data.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NavController, Platform } from '@ionic/angular';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
})
export class ConversationsPage implements OnInit {

  messages:any;

  constructor(private api: ApiService,
    private platform: Platform,
    private data: AppDataService,
    private utils: UtilsService,
    private nav: NavController) { 
      // this.platform.backButton.subscribe(() => {
      //   this.goBack()  
      // });
    }

  ngOnInit() {
    this.loadData();
  }

 async loadData(){


    try {

      this.utils.presentLoading('');
      let res= await this.api.get('conversations').toPromise();
      this.messages= res.data;
      console.log(res);
      
      this.utils.dismissLoading();
    } catch (error) {
      console.log(error);
      this.utils.dismissLoading();
    }

  }

  openConversations(shop_id){

    let product={
      id: null,
      shop:{
        id: shop_id
      }
    }

    this.data.product= product;
    this.nav.navigateForward(['contact-seller']);

  }

  goBack(){
    this.nav.back();
  }

}
