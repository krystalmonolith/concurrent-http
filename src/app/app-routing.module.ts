import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConcatComponent} from '../components/concat/concat.component';
import {MergeComponent} from '../components/merge/merge.component';
import {MergeRetryComponent} from '../components/merge-retry/merge-retry.component';

const routes: Routes = [
  {path: 'concat', component: ConcatComponent},
  {path: 'merge', component: MergeComponent},
  {path: 'mergeretry', component: MergeRetryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
