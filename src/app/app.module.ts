import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { NavLinkComponent } from './header/nav-link/nav-link.component';
import { HeaderComponent } from './header/header/header.component';
import { FindCatsComponent } from './components/find-cats/find-cats.component';
import { LandingComponent } from './components/landing/landing.component';
import { MatSelectComponent } from './components/find-cats/form/mat-select/mat-select.component';
import { MatAutocompleteComponent } from './components/find-cats/form/mat-autocomplete/mat-autocomplete.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { CapitalizeFirstLetterPipe } from './pipes/capitalize-first-letter.pipe';
import { ContentCatImagesComponent } from './components/find-cats/content-cat-images/content-cat-images.component';
import { DrawerFilterComponent } from './components/find-cats/drawer-filter/drawer-filter.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    AppComponent,
    NavLinkComponent,
    PageNotFoundComponent,
    FindCatsComponent,
    CapitalizeFirstLetterPipe,
    LandingComponent,
    MatSelectComponent,
    MatAutocompleteComponent,
    HeaderComponent,
    ContentCatImagesComponent,
    DrawerFilterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSkeletonLoaderModule,
    ScrollingModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatBadgeModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
