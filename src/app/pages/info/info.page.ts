import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { ApiService } from 'src/app/services/api.service';
import { AppDataService } from 'src/app/services/app-data.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  page:any
  info:any;
  doc: Document;

  constructor(private utils: UtilsService, 
    private api: ApiService,
    private appData: AppDataService) { }

  ngOnInit() {

    this.page= this.appData.page;

    this.loadData();
  }


 async loadData(){

    try {
      
      this.utils.presentLoading('');
     let res= await this.api.get(`page/${this.page}`).toPromise();
      console.log(res);

      this.info= res.data;
      this.doc = new DOMParser().parseFromString(this.info.content, "text/xml")
      
     this.utils.dismissLoading();
    } catch (error) {
      console.log(error);
      
      this.utils.dismissLoading();
      
    }
  }

}
