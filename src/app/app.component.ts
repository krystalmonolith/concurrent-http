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
    {label: 'RxJS concat', route: '/concat'},
    {label: 'RxJS merge', route: '/merge'},
    {label: 'RxJS merge with retry', route: '/mergeretry'}
  ];
  background: ThemePalette = 'primary';
}
