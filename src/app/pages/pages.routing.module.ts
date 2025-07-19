// src/app/pages/pages.routing.module.ts
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppDashboardComponent } from './dashboard/dashboard.component';
const routes: Routes = [
  {
    path: '',
    component: AppDashboardComponent,
    data: { title: 'Dashboard' },
  },
];


@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PagesRoutingModule {}
