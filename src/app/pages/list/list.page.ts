import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  private listSlug = "";
  public lists;
  isHidden = true;

  constructor(
    private router: Router,
    private platform: Platform,
    private nav: NavController,
    private utils: UtilsService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,) { 
    this.listSlug = this.activatedRoute.snapshot.paramMap.get('slug');
    console.log(window.location.pathname);
    // this.platform.backButton.subscribe(() => {
    //    utils.backButtonPress(window.location.pathname);
    // });
  }

  ngOnInit() {
    this.utils.presentLoading("Please wait");
    this.loadList();
  }

  goBack(){
    this.nav.back();
  }

  loadList() {
    this.api.category_details(this.listSlug).subscribe(
        r => {
          console.log(r.data);
          this.lists = r.data;
          if (this.lists.length != 0) {
            this.isHidden = false;
          }
          this.utils.dismissLoading();
        }
      )
  }

  openProduct(slug) {
    console.log(slug);
    this.router.navigate(["/product"], { queryParams: { slug: slug} });
  }

}
