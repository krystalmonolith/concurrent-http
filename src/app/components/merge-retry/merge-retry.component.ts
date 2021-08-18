import {Component, OnInit} from '@angular/core';
import {ImageGridComponent} from '../image-grid/image-grid.component';

@Component({
  selector: 'app-merge-retry',
  templateUrl: './merge-retry.component.html',
  styleUrls: ['./merge-retry.component.scss']
})
export class MergeRetryComponent implements OnInit {

  readonly mode = ImageGridComponent.FETCH_MODE_MERGERETRY;

  constructor() {
  }

  ngOnInit(): void {
  }
}
