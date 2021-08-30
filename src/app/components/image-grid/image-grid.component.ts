import {Component, Input, OnInit} from '@angular/core';
import {FileService} from '../../services/file.service';
import {defer, from, Observable} from 'rxjs';
import {concatAll, map, mergeAll, retry} from 'rxjs/operators';
import {Base64ArrayBuffer} from './Base64ArrayBuffer';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.scss']
})
export class ImageGridComponent implements OnInit {

  fileList: Array<string> = [];

  static readonly RETRY_COUNT = 5;

  static readonly FETCH_MODE_CONCAT = 'CONCAT';
  static readonly FETCH_MODE_MERGE = 'MERGE';
  static readonly FETCH_MODE_MERGERETRY = 'MERGE RETRY';
  @Input() fetchMode: string = '';

  @Input() title: string = '';

  images: Array<string> = [];
  imageFetchError?: string;
  imageFetchErrorFilename?: string;

  constructor(private fileService: FileService) {
  }

  ngOnInit(): void {
    this.loadList();
  }

  loadImagesConcatAll(): Observable<void> {
    return new Observable(subscriber => {
      from(this.fileList)
        .pipe(
          map((file: string) => defer(() => this.fileService.getFile(file))),
          concatAll()
        )
        .subscribe(
          (fileResponse: ArrayBuffer) => {
            this.images.push('data:image/png;base64,' + Base64ArrayBuffer.encode(fileResponse));
          },
          (err: any) => {
            subscriber.error(err);
          },
          () => {
            console.log(`loadImagesConcatAll() COMPLETE!`);
          }
        );
    });
  }

  loadImagesMergeAll(): Observable<void> {
    return new Observable(subscriber => {
      from(this.fileList)
        .pipe(
          map((file: string) => defer(() => this.fileService.getFile(file))),
          mergeAll(20)
        )
        .subscribe(
          (fileResponse: ArrayBuffer) => {
            this.images.push('data:image/png;base64,' + Base64ArrayBuffer.encode(fileResponse));
          },
          (err: any) => {
            subscriber.error(err);
          },
          () => {
            console.log(`loadImagesMergeAll() COMPLETE!`);
          }
        );
    });
  }

  loadImagesMergeAllWithRetry(): Observable<void> {
    return new Observable(subscriber => {
      from(this.fileList)
        .pipe(
          map((file: string) => defer(() => this.fileService.getFile(file).pipe(retry(ImageGridComponent.RETRY_COUNT)))),
          mergeAll(20)
        )
        .subscribe(
          (fileResponse: ArrayBuffer) => {
            this.images.push('data:image/png;base64,' + Base64ArrayBuffer.encode(fileResponse));
          },
          (err: any) => {
            subscriber.error(err);
          },
          () => {
            console.log(`loadImagesMergeAllWithRetry() COMPLETE!`);
          }
        );
    });
  }

  loadList(): void {
    this.fileList = [];
    this.images = [];
    this.imageFetchError = undefined;
    this.imageFetchErrorFilename = undefined;
    this.fileService.getFileList()
      .subscribe(s => {
        this.fileList = s;
        this.loadImagesMergeAll().subscribe({
          error: err => {
            this.imageFetchError = `${err['status']} ${err['statusText']}`;
            this.imageFetchErrorFilename = err['url'];
          }
        });
      });
  }

  refresh() {
    this.loadList();
  }
}
