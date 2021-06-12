import { Component, OnInit } from "@angular/core";
import { Data } from "@angular/router";
import { AppDataService } from "src/app/services/app-data.service";
import { ApiService } from "src/app/services/api.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-blog",
  templateUrl: "./blog.page.html",
  styleUrls: ["./blog.page.scss"],
})
export class BlogPage implements OnInit {
  post: any;
  blog: any;

  constructor(
    private utils: UtilsService,
    private api: ApiService,
    private data: AppDataService
  ) {
    this.post = data.post;
  }

  ngOnInit() {
    this.getBlog();
  }

  async getBlog() {
    this.utils.presentLoading("");

    try {
      this.blog = (await this.api.get(`blog/${this.post.slug}`).toPromise())[
        "data"
      ];
      this.utils.dismissLoading();
      console.log(this.blog);
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
      this.utils.presentToast(error.error.message);
    }
  }
}
