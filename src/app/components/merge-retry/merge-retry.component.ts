import {Component} from '@angular/core';
import {ImageGridComponent} from '../image-grid/image-grid.component';
import {FileService} from '../../services/file.service';
import {defer, from, Observable} from 'rxjs';
import {map, mergeAll, retry} from 'rxjs/operators';

@Component({
  selector: 'app-merge-retry',
  templateUrl: './merge-retry.component.html',
  styleUrls: ['./merge-retry.component.scss']
})
export class MergeRetryComponent {

  static readonly CONCURRENT_GET_COUNT = 20;
  static readonly RETRY_COUNT = 5;

  constructor(private fileService: FileService) {
  }

  loadImagesMergeAllWithRetry(fileList: Array<string>,
                              imageGridComponent: ImageGridComponent,
                              imagePusher: (imageGridComponent: ImageGridComponent, fileResponse: ArrayBuffer) => void): Observable<void> {
    return new Observable(subscriber => {
      from(fileList)
        .pipe(
          map((file: string) => defer(() => this.fileService.getFile(file).pipe(retry(MergeRetryComponent.RETRY_COUNT)))),
          mergeAll(MergeRetryComponent.CONCURRENT_GET_COUNT) // PARALLEL !!!
        )
        .subscribe(
          (fileResponse: ArrayBuffer) => imagePusher(imageGridComponent, fileResponse),
          (err: any) => subscriber.error(err),
          () => console.log(`Image loading via mergeAll() with retry() COMPLETE!`)
        );
    });
  }
}
