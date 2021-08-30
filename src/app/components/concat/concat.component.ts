import {Component} from '@angular/core';
import {ImageGridComponent} from '../image-grid/image-grid.component';
import {FileService} from '../../services/file.service';
import {defer, from, Observable} from 'rxjs';
import {concatAll, map} from 'rxjs/operators';

@Component({
  selector: 'app-concat',
  templateUrl: './concat.component.html',
  styleUrls: ['./concat.component.scss']
})
export class ConcatComponent {

  constructor(private fileService: FileService) {
  }

  loadImagesConcatAll(fileList: Array<string>,
                      imageGridComponent: ImageGridComponent,
                      imagePusher: (imageGridComponent: ImageGridComponent, fileResponse: ArrayBuffer) => void): Observable<void> {
    return new Observable(subscriber => {
      from(fileList)
        .pipe(
          map((file: string) => defer(() => this.fileService.getFile(file))),
          concatAll() // SEQUENTIAL !!!
        )
        .subscribe(
          (fileResponse: ArrayBuffer) => imagePusher(imageGridComponent, fileResponse),
          (err: any) => subscriber.error(err),
          () => console.log(`Image loading via concatAll() COMPLETE!`)
        );
    });
  }
}
