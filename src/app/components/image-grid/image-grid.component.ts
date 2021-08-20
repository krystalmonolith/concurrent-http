import {Component, Input, OnInit} from '@angular/core';
import {FileService} from '../../services/file.service';
import {defer, from, Observable} from 'rxjs';
import {map, mergeAll} from 'rxjs/operators';
import {Base64ArrayBuffer} from './Base64ArrayBuffer';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.scss']
})
export class ImageGridComponent implements OnInit {

  fileList: Array<string> = [];

  static readonly FETCH_MODE_CONCAT = 'CONCAT';
  static readonly FETCH_MODE_MERGE = 'MERGE';
  static readonly FETCH_MODE_MERGERETRY = 'MERGE RETRY';
  @Input() fetchMode: string = '';

  @Input() title: string = '';

  images: Array<string> = [];

  constructor(private fileService: FileService) {
  }

  ngOnInit(): void {
    this.loadList();
  }

  loadImages(): Observable<void> {
    return new Observable(subscriber => {
      from(this.fileList)
        .pipe(
          map((file: string) => defer(() => this.fileService.getFile(file))),
          //concatAll()
          mergeAll(20)
        )
        .subscribe(
          (fileResponse: ArrayBuffer) => {
            this.images.push('data:image/png;base64,' + Base64ArrayBuffer.encode(fileResponse));
          },
          (err: any) => {
            console.error(`LOADIMAGES ERROR1: ${JSON.stringify(err, null, 2)}`);
            subscriber.error(err);
          },
          () => {
            console.log(`LOADIMAGES COMPLETE!`);
          }
        );
    });
  }

  loadList(): void {
    this.fileList = [];
    this.images = [];
    this.fileService.getFileList()
      .subscribe(s => {
        this.fileList = s;
        this.loadImages().subscribe({
          error: err => {
            console.error(`LOADIMAGES ERROR2: ${JSON.stringify(err, null, 2)}`);
            throw err;
          }
        });
      });
  }

  refresh() {
    this.loadList();
  }
}
