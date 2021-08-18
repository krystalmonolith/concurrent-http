import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card'
import {ConcatComponent} from './components/concat/concat.component';
import {MergeComponent} from './components/merge/merge.component';
import {MergeRetryComponent} from './components/merge-retry/merge-retry.component';
import {HttpClientModule} from '@angular/common/http';
import {FileService} from './services/file.service';

@NgModule({
  declarations: [
    AppComponent,
    ConcatComponent,
    MergeComponent,
    MergeRetryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatTabsModule
  ],
  providers: [
    FileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
