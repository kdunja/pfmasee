import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';

export interface productsData {
  id: number;
  imagePath: string;
  uname: string;
  date: Date;
  budget: number;
  direction: 'credit' | 'debit';
  currency?: string;
  kind?: string;
  isSplit?: boolean;
  category?: string;
}

const ELEMENT_DATA: productsData[] = [
  {
    id: 1,
    imagePath: 'assets/images/profile/user-1.jpg',
    uname: 'Ognjen Ognjenović',
    date: new Date('2024-04-17'),
    budget: 3.9,
    currency: 'RSD',
    direction: 'credit',
    kind: 'EXECUTED',
    isSplit: false,
    category: 'Salary'
  },
  {
    id: 2,
    imagePath: 'assets/images/profile/user-2.jpg',
    uname: 'Dejana Jovanović',
    date: new Date('2024-04-17'),
    budget: 24.5,
    currency: 'RSD',
    direction: 'debit',
    kind: 'REJECTED',
    isSplit: false,
    category: 'Groceries'
  },
  {
    id: 3,
    imagePath: 'assets/images/profile/user-5.jpg',
    uname: 'Wolt',
    date: new Date('2024-04-17'),
    budget: 12.8,
    currency: 'RSD',
    direction: 'debit',
    kind: 'EXECUTED',
    isSplit: true,
    category: 'Food Delivery'
  },
  {
    id: 4,
    imagePath: 'assets/images/profile/user-6.jpg ',
    uname: 'Cineplexx',
    date: new Date('2024-04-17'),
    budget: 2.4,
    currency: 'RSD',
    direction: 'credit',
    kind: 'EXECUTED',
    isSplit: false,
    category: 'Refund'
  },
  {
    id: 5,
    imagePath: 'assets/images/profile/user-10.jpg',
    uname: 'Ivana Marković',
    date: new Date('2024-05-01'),
    budget: 15.2,
    currency: 'RSD',
    direction: 'credit',
    kind: 'PENDING',
    isSplit: false,
    category: 'Bonus'
  },
  {
    id: 6,
    imagePath: 'assets/images/profile/user-12.jpg',
    uname: 'Milan Petrović',
    date: new Date('2024-05-03'),
    budget: 8.7,
    currency: 'RSD',
    direction: 'debit',
    kind: 'EXECUTED',
    isSplit: false,
    category: 'Transport'
  },
  {
    id: 7,
    imagePath: 'assets/images/profile/user-4.jpg',
    uname: 'Luka Cvjetić',
    date: new Date('2024-05-05'),
    budget: 20.0,
    currency: 'RSD',
    direction: 'credit',
    kind: 'EXECUTED',
    isSplit: false,
    category: 'Freelance'
  },
  {
  id: 8,
  imagePath: 'assets/images/profile/user-7.jpg',
  uname: 'Mc Donalds',
  date: new Date('2024-05-06'),
  budget: 6.3,
  currency: 'RSD',
  direction: 'debit',
  kind: 'EXECUTED',
  isSplit: false,
  category: 'Restaurants & cafés'
},
{
  id: 9,
  imagePath: 'assets/images/profile/user-8.jpg',
  uname: 'MTS Telekom',
  date: new Date('2024-05-07'),
  budget: 2.5,
  currency: 'RSD',
  direction: 'debit',
  kind: 'EXECUTED',
  isSplit: false,
  category: 'Mobile phone'
},
{
  id: 10,
  imagePath: 'assets/images/profile/user-11.jpg',
  uname: 'Jelena Vasiljević',
  date: new Date('2024-05-08'),
  budget: 18.4,
  currency: 'RSD',
  direction: 'credit',
  kind: 'EXECUTED',
  isSplit: true,
  category: 'Freelance'
},
{
  id: 11,
  imagePath: 'assets/images/profile/user-9.jpg',
  uname: 'EKO Gas station',
  date: new Date('2024-05-08'),
  budget: 4.7,
  currency: 'RSD',
  direction: 'debit',
  kind: 'EXECUTED',
  isSplit: false,
  category: 'Transport'
},
{
  id: 12,
  imagePath: 'assets/images/profile/user-14.jpg',
  uname: 'City of Novi Sad',
  date: new Date('2024-05-09'),
  budget: 9.0,
  currency: 'RSD',
  direction: 'debit',
  kind: 'PENDING',
  isSplit: false,
  category: 'Utilities'
},
{
  id: 13,
  imagePath: 'assets/images/profile/user-12.jpg',
  uname: 'Marko Stevanović',
  date: new Date('2024-05-10'),
  budget: 20.0,
  currency: 'RSD',
  direction: 'credit',
  kind: 'EXECUTED',
  isSplit: false,
  category: 'Salary'
}

];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppDashboardComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  displayedColumns: string[] = ['assigned', 'name', 'budget', 'direction'];
  dataSource = ELEMENT_DATA;

  kinds: string[] = ['EXECUTED', 'REJECTED', 'FUTURE', 'DRAFT', 'PENDING'];
  selectedKind: string = 'EXECUTED';

  selectedTab: string = 'overview';

  setSelectedTab(tab: string): void {
    this.selectedTab = tab;
  }

  get filteredData(): productsData[] {
    return ELEMENT_DATA
      .filter(t => t.kind === this.selectedKind)
      .sort((a, b) => {
        const dateDiff = b.date.getTime() - a.date.getTime();
        if (dateDiff !== 0) return dateDiff;

        // Ako su datumi isti, sortiraj po kategoriji rastuće
        if (!a.category) return 1;
        if (!b.category) return -1;
        return a.category.localeCompare(b.category);
      });
  }

  onSplitTransaction(element: productsData) {
    console.log('Split transaction clicked for:', element);
    // Ovde ide dalja logika za split
  }

  constructor() {
    // ovde možeš imati chart i druge stvari
  }
  exportToCSV(): void {
  const headers = ['ID', 'Ime', 'Datum', 'Iznos', 'Valuta', 'Tip', 'Kategorija'];
  const rows = this.filteredData.map(item => [
    item.id,
    item.uname,
    item.date.toISOString().split('T')[0],
    item.budget,
    item.currency || '',
    item.direction,
    item.category || ''
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers, ...rows]
      .map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'transactions.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

}