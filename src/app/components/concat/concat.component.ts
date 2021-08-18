import {Component, OnInit} from '@angular/core';
import {FileList, FileService} from '../../services/file.service';

@Component({
  selector: 'app-concat',
  templateUrl: './concat.component.html',
  styleUrls: ['./concat.component.scss']
})
export class ConcatComponent implements OnInit {

  fileList: Array<string> = [];

  constructor(private fileService: FileService) {
  }

  ngOnInit(): void {
    this.fileService.getFileList(FileList.SMALL).subscribe(s => this.fileList = s);
  }

}
