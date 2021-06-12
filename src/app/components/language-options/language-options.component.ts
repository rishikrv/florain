import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { PopoverController } from "@ionic/angular";

@Component({
  selector: "language-options",
  templateUrl: "./language-options.component.html",
  styleUrls: ["./language-options.component.scss"],
})
export class LanguageOptionsComponent implements OnInit {
  lang: any;
  constructor(
    public translate: TranslateService,
    public popover: PopoverController
  ) {}

  ngOnInit() {
    this.getDefaultLanguage();
  }

  getDefaultLanguage() {
    this.lang = localStorage.getItem("lang") || "en";
  }

  onValueChange(event) {
    console.log(event);

    let lang = event.detail.value;
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    localStorage.setItem("lang", lang);
    this.popover.dismiss();
  }
}
