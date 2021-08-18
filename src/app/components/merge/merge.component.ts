import { Component, OnInit } from '@angular/core';
import {ImageGridComponent} from '../image-grid/image-grid.component';

@Component({
  selector: 'app-merge',
  templateUrl: './merge.component.html',
  styleUrls: ['./merge.component.scss']
})
export class MergeComponent implements OnInit {

  readonly mode = ImageGridComponent.FETCH_MODE_MERGE;

  constructor() { }

  ngOnInit(): void {
  }

}
