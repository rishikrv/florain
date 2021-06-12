import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "loading-list",
  templateUrl: "./loading-list.component.html",
  styleUrls: ["./loading-list.component.scss"],
})
export class LoadingListComponent implements OnInit {
  @Input() loading;

  constructor() {}

  ngOnInit() {
    console.log(this.loading);
  }
}
