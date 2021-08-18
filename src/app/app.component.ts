import {Component, ElementRef, ViewChild} from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'concurrent-http';
  @ViewChild('sliderText') sliderText!: ElementRef;

  links = [
    {label: 'RxJS concatAll()', route: '/concat'},
    {label: 'RxJS mergeAll()', route: '/merge'},
    {label: 'RxJS mergeAll() with retry', route: '/mergeretry'}
  ];
  background: ThemePalette = 'primary';
}
