import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppDashboardComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  displayedColumns: string[] = [
    'beneficiary', 'date', 'direction', 'amount', 'description'
  ];
  

  kinds: string[] = ['EXECUTED', 'REJECTED', 'FUTURE', 'DRAFT', 'PENDING']; 
 selectedKind: string = 'pmt'; // ili neka vrednost iz JSON-a

  selectedTab: string = 'overview';

  // PAGINACIJA
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  allTransactions: any[] = [];
  paginatedData: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
  this.http.get<any[]>('assets/transactions.json')
    .subscribe(data => {
      console.log('Loaded transactions:', data); // vidi u konzoli
      this.allTransactions = data.map(t => ({
        ...t,
        date: new Date(t.date)
      }));
      this.updatePagination();
    });
  }

  setSelectedTab(tab: string): void {
    this.selectedTab = tab;
  }

  onKindSelected = (kind: string) => {
    this.selectedKind = kind;
    this.currentPage = 1;
    this.updatePagination();
  };

  get filteredData(): any[] {
  return this.allTransactions; // privremeno bez filtera!
}


updatePagination() {
  const filtered = this.filteredData;
  console.log('FILTERED LENGTH:', filtered.length);
  this.totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
  if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  this.paginatedData = filtered.slice(start, end);
  console.log('PAGINATED DATA IDs:', this.paginatedData.map(x => x.id));
}



onPageChange(page: number): void {
  console.log('onPageChange called! Novi page:', page);
  this.currentPage = page;
  this.updatePagination();
}



  onSplitTransaction(transaction: any): void {
    console.log('Split for transaction:', transaction);
  }

  exportToCSV(): void {
    const headers = [
      'ID', 'Beneficiary', 'Datum', 'Smer', 'Iznos', 'Opis', 'Valuta', 'MCC', 'Kind'
    ];
    const rows = this.filteredData.map(item => [
      item.id,
      item['beneficiary-name'],
      item.date instanceof Date ? item.date.toISOString().split('T')[0] : item.date,
      item.direction,
      item.amount,
      item.description,
      item.currency,
      item.mcc,
      item.kind
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
