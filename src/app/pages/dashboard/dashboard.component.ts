import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';

import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
} from 'ng-apexcharts';

interface month {
  value: string;
  viewValue: string;
}

export interface yearlyChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}

interface stats {
  id: number;
  time: string;
  color: string;
  title?: string;
  subtext?: string;
  link?: string;
}

export interface productsData {
  id: number;
  imagePath: string;
  uname: string;
  date: Date;
  budget: number;
  direction: 'credit' | 'debit';
 
}

// ecommerce card
interface productcards {
  id: number;
  imgSrc: string;
  title: string;
  price: string;
  rprice: string;
}

const ELEMENT_DATA: productsData[] = [
  {
    id: 1,
    imagePath: 'assets/images/profile/user-1.jpg',
    uname: 'Ognjen Ognjenović',
    date: new Date('2024-04-17'),
    budget: 3.9,
    direction: 'credit'  
  },
  {
    id: 2,
    imagePath: 'assets/images/profile/user-2.jpg',
    uname: 'Paja Jovanović',
    date: new Date('2024-04-17'),
    budget: 24.5,
    direction: 'debit'  
  },
  {
    id: 3,
    imagePath: 'assets/images/profile/user-3.jpg',
    uname: 'Wolt',
    date: new Date('2024-04-17'),
    budget: 12.8,
    direction: 'debit'  
  },
  {
    id: 4,
    imagePath: 'assets/images/profile/user-4.jpg',
    uname: 'Cineplex',
    date: new Date('2024-04-17'),
    budget: 2.4,
    direction: 'credit'  
  },
   {
    id: 5,
    imagePath: 'assets/images/profile/user-5.jpg',
    uname: 'Ivana Marković',
    date: new Date('2024-05-01'),
    budget: 15.2,
    direction: 'credit'
  },
  {
    id: 6,
    imagePath: 'assets/images/profile/user-6.jpg',
    uname: 'Milan Petrović',
    date: new Date('2024-05-03'),
    budget: 8.7,
    direction: 'debit'
  },
  {
    id: 7,
    imagePath: 'assets/images/profile/user-7.jpg',
    uname: 'Dunja Kostić',
    date: new Date('2024-05-05'),
    budget: 20.0,
    direction: 'credit'
  }
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppDashboardComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public yearlyChart!: Partial<yearlyChart> | any;

  displayedColumns: string[] = ['assigned', 'name','budget', 'direction'];
  dataSource = ELEMENT_DATA;

  kinds: string[] = ['EXECUTED', 'REJECTED', 'FUTURE', 'DRAFT', 'PENDING'];
selectedKind: string = 'EXECUTED';

onSplitTransaction(element: any) {
  console.log('Split transaction clicked for:', element);
  // Ovde ide tvoj kod za dalju akciju
}

//funkcionalnost za tabove s desne

selectedTab: string = 'overview';

setSelectedTab(tab: string): void {
  this.selectedTab = tab;
}

  constructor() {

    // yearly breakup chart
    this.yearlyChart = {
      series: [38, 40, 25],

      chart: {
        type: 'donut',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 130,
      },
      colors: ['#5D87FF', '#ECF2FF', '#F9F9FD'],
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          donut: {
            size: '75%',
            background: 'transparent',
          },
        },
      },
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 991,
          options: {
            chart: {
              width: 120,
            },
          },
        },
      ],
      tooltip: {
        enabled: false,
      },
    };
  }
}