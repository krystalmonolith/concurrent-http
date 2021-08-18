import {Component, OnInit, ViewChild} from '@angular/core';
import {FileList, FileService} from '../../services/file.service';
import {MatButtonToggleGroup} from '@angular/material/button-toggle';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.scss']
})
export class ImageGridComponent implements OnInit {

  readonly VALUE_SMALL = 'Small Images (100x100)';
  readonly VALUE_LARGE = 'Large Images (640x480)';

  fileSize: string = this.VALUE_SMALL;
  fileList: Array<string> = [];
  @ViewChild('fileSizeGroup') fileSizeGroup?: MatButtonToggleGroup;

  constructor(private fileService: FileService) {
  }

  loadList() {
      this.fileService.getFileList(this.fileSize === this.VALUE_SMALL ? FileList.SMALL : FileList.LARGE).subscribe(s => this.fileList = s);
  }

  ngOnInit(): void {
  }

  fileSizeValueChange($event: any) {
    if ($event) {
      this.fileSize = $event;
      this.loadList();
    }
  }
}
