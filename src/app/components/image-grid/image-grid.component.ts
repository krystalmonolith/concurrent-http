import {Component, Input, OnInit} from '@angular/core';
import {FileService} from '../../services/file.service';
import {Observable} from 'rxjs';
import {Base64ArrayBuffer} from './Base64ArrayBuffer';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.scss']
})
export class ImageGridComponent implements OnInit {

  images: Array<string> = [];
  imageFetchError?: string;
  imageFetchErrorFilename?: string;


  @Input() title: string = '';  // The title string for the current tab.

  //
  // First I tried an object oriented inheritance pattern with ImageGridComponent as a subclass
  // to superclasses ConcatComponent, MergeComponent, and MergeRetryComponent... and it was a Disaster!
  //
  // Then I tried a delegation pattern with the ConcatComponent, MergeComponent, and MergeRetryComponent classes
  // delegating their loadImagesConcatAll, loadImagesMergeAll, and loadImagesMergeAllWithRetry functions
  // through the 'loadDelegate' @Input() property... Much Happier!
  //
  // The downside is the tight coupling between the classes, i.e., ConcatComponent, MergeComponent,
  // and MergeRetryComponent 'knowing' too much about ImageGridComponent.
  //
  // Could DI and a Image Storage service pattern help us here?
  //

  @Input() loadImageDelegate?: (fileList: Array<string>,  // The list of files to be rendered.
                                imageGridComponent: ImageGridComponent, // The correct 'this' for pushing images: See member function pushImage() below.
                                imagePusher: (imageGridComponent: ImageGridComponent, fileResponse: ArrayBuffer) => void) => Observable<void>; // The image pushing function.

  constructor(private fileService: FileService) {
  }

  ngOnInit(): void {
    this.loadList();
  }

  loadList(): void {
    // Clear out the old images and error information.
    this.images = [];
    this.imageFetchError = undefined;
    this.imageFetchErrorFilename = undefined;

    // Fetch the list of files from FileService.
    this.fileService.getFileList()
      .subscribe(fileList => {
        // Call the image loading delegate function to attempt to load all the images in the 'fileList'.
        this.loadImageDelegate!(fileList, this, this.pushImage).subscribe({
          error: err => {
            this.imageFetchError = `${err['status']} ${err['statusText']}`;
            this.imageFetchErrorFilename = err['url'];
          }
        });
      });
  }

  pushImage(imageGridComponent: ImageGridComponent, fileResponse: ArrayBuffer): void {
    imageGridComponent.images.push('data:image/png;base64,' + Base64ArrayBuffer.encode(fileResponse));
    // LINE BELOW DOES NOT WORK BECAUSE WHEN CALLED FROM THE DELEGATE 'this' IS THE DELEGATE'S 'this',
    // NOT ImageGridComponents's 'this'!
    //
    // this.images.push('data:image/png;base64,' + Base64ArrayBuffer.encode(fileResponse)); // NO!!!!
  }

  refresh() {
    this.loadList();
  }
}
