import { Component, OnInit } from '@angular/core';
import { AppDataService } from 'src/app/services/app-data.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {

  feedbacks=[];

  constructor(private data: AppDataService) { }

  ngOnInit() {

    this.feedbacks = this.data.feedbacks;
  }

}
