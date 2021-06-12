import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { UtilsService } from "src/app/services/utils.service";
import { ApiService } from "src/app/services/api.service";
import { AppDataService } from "src/app/services/app-data.service";

@Component({
  selector: "app-blogs",
  templateUrl: "./blogs.page.html",
  styleUrls: ["./blogs.page.scss"],
})
export class BlogsPage implements OnInit {
  posts: any[];
  blogs: any;

  constructor(
    public navCtrl: NavController,
    private utils: UtilsService,
    private api: ApiService,
    private data: AppDataService
  ) {
    this.loadPosts();
  }

  ngOnInit() {
    this.getBlogs();
  }

  async getBlogs() {
    this.utils.presentLoading("");

    try {
      this.blogs = await this.api.get("blogs").toPromise();
      this.utils.dismissLoading();
      console.log(this.blogs);
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
    }
  }

  async loadBlogs(link, event?) {
    if (link) {
      let data = await this.api.get_full(link).toPromise();
      console.log(data);

      this.blogs["data"] = this.blogs["data"].concat(data.data);
      this.blogs["links"] = data.links;
      this.blogs["meta"] = data.meta;
    }

    if (event) {
      event.target.complete();
    }
  }

  loadPosts() {
    this.posts = [
      {
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        description: "Some description",
        image: "https://picsum.photos/400",
        date: "Jan 16, 2020",
      },
      {
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        description: "Some description",
        image: "https://picsum.photos/400",
        date: "Jan 16, 2020",
      },
    ];
  }

  openPost(post) {
    this.data.post = post;
    this.navCtrl.navigateForward(["blog"]);
  }
}
