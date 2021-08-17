import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatSliderModule} from '@angular/material/slider';
import {MatTabsModule} from '@angular/material/tabs';
import { ConcatComponent } from '../components/concat/concat.component';
import { MergeComponent } from '../components/merge/merge.component';
import { MergeretryComponent } from '../components/mergeretry/mergeretry.component';

@NgModule({
  declarations: [
    AppComponent,
    ConcatComponent,
    MergeComponent,
    MergeretryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
