import { Component, OnInit } from "@angular/core";
import { AppDataService } from "src/app/services/app-data.service";
import { NavController, Platform } from "@ionic/angular";
import { ApiService } from "src/app/services/api.service";
import { api_urls } from "src/environments/environment";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.page.html",
  styleUrls: ["./categories.page.scss"],
})
export class CategoriesPage implements OnInit {
  categories: Array<any>;
  constructor(
    public appData: AppDataService, 
    private api: ApiService,
    private platform: Platform,
    private utils: UtilsService,
    public nav: NavController) {
    this.loadCategories();
    // console.log(window.location.pathname);
    // this.platform.backButton.subscribe(() => {
    //    utils.backButtonPress(window.location.pathname);
    // });
  //   this.platform.backButton.subscribe(() => {
  //     utils.backButtonPress(window.location.pathname);
  //  });
  }

  async loadCategories() {
    this.categories = (await this.api.get(api_urls.grps).toPromise())["data"];
    // this.categories = this.appData.getData("categories");
    this.utils.dismissLoading();
  }

  ngOnInit() {}

  openCategory(cat) {
    this.appData.category = cat;
    this.nav.navigateForward(["category"]);
  }

  goBack() {
    this.nav.back();
  }
}
