import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatSliderChange} from '@angular/material/slider';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'concurrent-http';
  @ViewChild('sliderText') sliderText!: ElementRef;

  links = ['RxJS concat','RxJS merge','RxJS merge with retry'];
  activeLink = this.links[0];
  background: ThemePalette = undefined;

  ngOnInit() {
    this.background = 'primary';
  }

  toggleBackground() {
    this.background = this.background ? undefined : 'primary';
  }

  sliderChange($event: MatSliderChange) {
    console.log(`SliderChange: ${$event.value}`);
    this.sliderText.nativeElement.value = `${$event.value}`;
  }

  sliderValueChange($event: MatSliderChange) {
    console.log(`SliderValue: ${$event.value}`);
    this.sliderText.nativeElement.value = `${$event.value}`;
  }
}
