import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ProfileCompanyComponent } from './profile-company/profile-company.component';


@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    ProfileComponent,
    ProfileCompanyComponent
  ],
  exports: [
    PagesComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
  ]
})
export class PagesModule { }