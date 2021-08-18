import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

const BASEURL = 'http://localhost:3000/';

export enum FileList {
  SMALL,
  LARGE
}

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  getFileList(fileSize: FileList): Observable<Array<string>> {
    const smallLarge = (fileSize == FileList.SMALL ? 'small' : 'large');
    return this.http.get<Array<string>>(BASEURL + smallLarge + '/filelist');
  }
}
