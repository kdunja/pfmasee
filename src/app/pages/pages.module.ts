import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { PagesRoutingModule }     from './pages.routing.module';
import { NgApexchartsModule }     from 'ng-apexcharts';
import { AccountInfoComponent } from './dashboard/account-info/account-info.component';
import { TransactionTableComponent } from './dashboard/transaction-table/transaction-table.component';
import { SidebarTabsComponent } from './dashboard/sidebar-tabs/sidebar-tabs.component';
import { TransactionFiltersComponent } from './dashboard/transaction-filters/transaction-filters.component';
import { ExportPaginationComponent } from './dashboard/export-pagination/export-pagination.component';
import { HttpClientModule } from '@angular/common/http';
import { SpendingChartsComponent } from './dashboard/spending-charts/spending-charts.component';
import { TooltipModule } from '@swimlane/ngx-charts';


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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


// Tabler Icons
import { TablerIconsModule }      from 'angular-tabler-icons';
import * as TablerIcons           from 'angular-tabler-icons/icons';

// Your components
import { AppDashboardComponent }  from './dashboard/dashboard.component';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    AppDashboardComponent, 
    AccountInfoComponent,       
    TransactionTableComponent,
    SidebarTabsComponent,
     TransactionFiltersComponent,
     ExportPaginationComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    PagesRoutingModule,
    NgApexchartsModule,
    HttpClientModule,
    SpendingChartsComponent,
    TooltipModule,

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
    MatDatepickerModule,
    MatNativeDateModule,
     MatCheckboxModule,


    // Tabler icons
    TablerIconsModule.pick(TablerIcons),


  ]
})
export class PagesModule {}
