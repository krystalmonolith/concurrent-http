import {Component, OnInit} from '@angular/core';
import {ImageGridComponent} from '../image-grid/image-grid.component';

@Component({
  selector: 'app-concat',
  templateUrl: './concat.component.html',
  styleUrls: ['./concat.component.scss']
})
export class ConcatComponent implements OnInit {

  readonly mode = ImageGridComponent.FETCH_MODE_CONCAT;

  constructor() {
  }

  ngOnInit(): void {
  }
}
