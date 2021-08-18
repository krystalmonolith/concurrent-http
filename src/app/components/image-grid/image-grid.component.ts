import {Component, Input, OnInit} from '@angular/core';
import {FileService} from '../../services/file.service';
import {defer, from} from 'rxjs';
import {map, mergeAll} from 'rxjs/operators';

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
  fileFailPercent: number = 0;

  constructor(private fileService: FileService) {
  }

  static readonly encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  static base64ArrayBuffer(arrayBuffer: ArrayBuffer): string {

    const bytes = new Uint8Array(arrayBuffer);
    const byteLength = bytes.byteLength;
    const byteRemainder = byteLength % 3;
    const mainLength = byteLength - byteRemainder;

    let a, b, c, d;
    let chunk;
    let base64 = '';

    // Main loop deals with bytes in chunks of 3
    for (let i = 0; i < mainLength; i = i + 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
      c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
      d = chunk & 63;               // 63       = 2^6 - 1

      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += ImageGridComponent.encodings[a] +
        ImageGridComponent.encodings[b] +
        ImageGridComponent.encodings[c] +
        ImageGridComponent.encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
      chunk = bytes[mainLength];

      a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

      // Set the 4 least significant bits to zero
      b = (chunk & 3) << 4; // 3   = 2^2 - 1

      base64 += ImageGridComponent.encodings[a] +
        ImageGridComponent.encodings[b] + '==';

    } else if (byteRemainder == 2) {

      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

      a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

      // Set the 2 least significant bits to zero
      c = (chunk & 15) << 2; // 15    = 2^4 - 1

      base64 += ImageGridComponent.encodings[a] +
        ImageGridComponent.encodings[b] +
        ImageGridComponent.encodings[c] + '=';
    }

    return base64;
  }

  loadImages(): void {
    from(this.fileList)
      .pipe(
        map((file: string) => defer(() => this.fileService.getFile(file))),
        //concatAll()
        mergeAll(20)
      )
      .subscribe(
        (fileResponse: ArrayBuffer) => {
          this.images.push('data:image/png;base64,' + ImageGridComponent.base64ArrayBuffer(fileResponse));
        },
        (err: any) => {
          console.error(err);
        },
        () => {
        }
      );
  }

  loadList(): void {
    this.fileService.getFileList()
      .subscribe(s => {
        console.log(`Slength: ${s.length}`)
        this.fileList = s;
        this.loadImages();
        this.updateFileFailPercent();
      });
  }

  ngOnInit(): void {
    this.loadList();
  }

  private updateFileFailPercent() {
    this.fileService.getFileFailPercent().subscribe(v => this.fileFailPercent = v);
  }
}
