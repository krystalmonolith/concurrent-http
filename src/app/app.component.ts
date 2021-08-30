import {Component, ElementRef, ViewChild} from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly title = 'concurrent-http';
  readonly version = '1.2.0';
  readonly buildDate = '20210830';
  readonly background: ThemePalette = 'primary';

  @ViewChild('sliderText') sliderText!: ElementRef;
  links = [
    {label: 'RxJS concatAll()', route: '/concat'},
    {label: 'RxJS mergeAll()', route: '/merge'},
    {label: 'RxJS mergeAll() with retry', route: '/mergeretry'}
  ];
}
