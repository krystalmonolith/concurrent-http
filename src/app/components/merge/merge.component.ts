import {Component} from '@angular/core';
import {FileService} from '../../services/file.service';
import {defer, from, Observable} from 'rxjs';
import {map, mergeAll} from 'rxjs/operators';
import {ImageGridComponent} from '../image-grid/image-grid.component';

@Component({
  selector: 'app-merge',
  templateUrl: './merge.component.html',
  styleUrls: ['./merge.component.scss']
})
export class MergeComponent {

  static readonly CONCURRENT_GET_COUNT = 20;

  constructor(private fileService: FileService) {
  }

  loadImagesMergeAll(fileList: Array<string>,
                     imageGridComponent: ImageGridComponent,
                     imagePusher: (imageGridComponent: ImageGridComponent, fileResponse: ArrayBuffer) => void): Observable<void> {
    return new Observable(subscriber => {
      from(fileList)
        .pipe(
          map((file: string) => defer(() => this.fileService.getFile(file))),
          mergeAll(MergeComponent.CONCURRENT_GET_COUNT) // PARALLEL !!!
        )
        .subscribe(
          (fileResponse: ArrayBuffer) => imagePusher(imageGridComponent, fileResponse),
          (err: any) => subscriber.error(err),
          () => console.log(`Image loading via mergeAll() COMPLETE!`)
        );
    });
  }
}
