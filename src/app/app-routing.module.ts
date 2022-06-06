import { FindCatsComponent } from './components/find-cats/find-cats.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { AuthGuard } from './guards/auth.guard';
import { StarredComponent } from './components/starred/starred.component';

const routes: Routes = [
  { path: '', component: LandingComponent, data: { next: 'find' } },
  { path: 'find', component: FindCatsComponent, canActivate: [AuthGuard] },
  {
    path: 'collection',
    component: StarredComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
