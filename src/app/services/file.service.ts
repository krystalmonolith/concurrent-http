import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

const BASEURL = 'http://localhost:3000/';

interface FileFailPercent {
  fileFailPercent: number;
}

interface FileDelayMsec {
  fileDelayMsec: number;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {


  constructor(private http: HttpClient) {
  }

  getFileList(): Observable<Array<string>> {
    return this.http.get<Array<string>>(BASEURL + 'filelist');
  }

  getFile(file: string): Observable<ArrayBuffer> {
    return this.http.get(BASEURL + 'file/' + file, {responseType: 'arraybuffer'});
  }

  getFileFailPercent(): Observable<number> {
    return this.http.get<FileFailPercent>(BASEURL + 'filefailpercent').pipe(map(v => v['fileFailPercent']));
  }

  putFileFailPercent(percent: number): void {
    this.http.put<number>(BASEURL + 'filefailpercent/' + percent, {})
      .subscribe({
        error: err => {
          throw `PUT PERCENT Error: ${JSON.stringify(err, null, 2)}`;
        }
      });
  }

  getFileDelayMsec(): Observable<number> {
    return this.http.get<FileDelayMsec>(BASEURL + 'filedelaymsec').pipe(map(v => v['fileDelayMsec']));
  }

  putFileDelayMsec(delay: number): void {
    this.http.put<number>(BASEURL + 'filedelaymsec/' + delay, {})
      .subscribe({
        error: err => {
          throw `PUT Delay Error: ${JSON.stringify(err, null, 2)}`;
        }
      });
  }
}
