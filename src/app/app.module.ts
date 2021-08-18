import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card'
import {MatIconModule} from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {FileService} from './services/file.service';
import {ImageGridComponent} from './components/image-grid/image-grid.component';
import {MergeComponent} from './components/merge/merge.component';
import {MergeRetryComponent} from './components/merge-retry/merge-retry.component';
import {ConcatComponent} from './components/concat/concat.component';

@NgModule({
  declarations: [
    AppComponent,
    ConcatComponent,
    MergeComponent,
    MergeRetryComponent,
    ImageGridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatIconModule
  ],
  providers: [
    FileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
