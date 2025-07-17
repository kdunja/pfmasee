// src/app/pages/pages.routing.module.ts
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppDashboardComponent } from './dashboard/dashboard.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';

const routes: Routes = [
  {
    path: '',
    component: AppDashboardComponent,
    data: { title: 'Dashboard' },
  },
  {
    path: 'transactions',
    component: TransactionListComponent,
  }
];


@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PagesRoutingModule {}
