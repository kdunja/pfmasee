// src/app/pages/pages.module.ts
import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { PagesRoutingModule }     from './pages.routing.module';
import { NgApexchartsModule }     from 'ng-apexcharts';

// Angular Material
import { MatCardModule }          from '@angular/material/card';
import { MatDividerModule }       from '@angular/material/divider';
import { MatTableModule }         from '@angular/material/table';
import { MatMenuModule }          from '@angular/material/menu';
import { MatBadgeModule }         from '@angular/material/badge';
import { MatTooltipModule }       from '@angular/material/tooltip';
import { MatSelectModule }        from '@angular/material/select';
import { MatFormFieldModule }     from '@angular/material/form-field';
import { MatButtonModule }        from '@angular/material/button';
import { MatIconModule }          from '@angular/material/icon';
import { MatInputModule }         from '@angular/material/input';

// Tabler Icons
import { TablerIconsModule }      from 'angular-tabler-icons';
import * as TablerIcons           from 'angular-tabler-icons/icons';

// Your components
import { AppDashboardComponent }  from './dashboard/dashboard.component';

// **DON’T** declare standalone components here — import them instead:
import { TransactionListComponent } from './transaction-list/transaction-list.component';

@NgModule({
  declarations: [
    AppDashboardComponent,        // your template
    // (no TransactionListComponent)

  ],
  imports: [
    CommonModule,
    FormsModule,
    PagesRoutingModule,
    NgApexchartsModule,

    // Material
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,

    // Tabler icons
    TablerIconsModule.pick(TablerIcons),


  ]
})
export class PagesModule {}
