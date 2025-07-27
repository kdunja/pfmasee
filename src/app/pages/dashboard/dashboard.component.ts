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

  displayedColumns: string[] = ['beneficiary', 'date', 'amount', 'description'];

  kinds: string[] = ['EXECUTED', 'REJECTED', 'FUTURE', 'DRAFT', 'PENDING'];
  selectedKind: string = 'EXECUTED';
  selectedTab: string = 'overview';

  currentPage: number = 1;
  pageSize: number = 7;
  totalPages: number = 1;

  allTransactions: any[] = [];
  paginatedData: any[] = [];

  // ✅ Dodato zbog greške
  categories: string[] = [];
  subcategories: string[] = [];

  // Mapiranje kind → tab
  readonly kindGroupMap: { [key: string]: string } = {
    pmt: 'EXECUTED',
    fee: 'FUTURE',
    wdw: 'EXECUTED',
    sal: 'EXECUTED',
    dep: 'FUTURE',
    trf: 'PENDING',
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('assets/transactions.json').subscribe((data) => {
      this.allTransactions = data.map((t) => ({
        ...t,
        date: new Date(t.date),
      }));

      this.extractCategoriesAndSubcategories();
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
    let data = this.allTransactions;

    if (this.selectedKind) {
      data = data.filter((t) => this.kindGroupMap[t.kind] === this.selectedKind);
    }

    return data.sort((a, b) => {
      const dateDiff = b.date.getTime() - a.date.getTime();
      if (dateDiff !== 0) return dateDiff;
      if (!a.category) return 1;
      if (!b.category) return -1;
      return a.category.localeCompare(b.category);
    });
  }

  updatePagination() {
    const filtered = this.filteredData;
    this.totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = filtered.slice(start, end);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  onSplitTransaction(transaction: any): void {
    console.log('Split for transaction:', transaction);
  }

  exportToCSV(): void {
    const headers = [
      'ID',
      'Beneficiary',
      'Datum',
      'Smer',
      'Iznos',
      'Opis',
      'Valuta',
      'MCC',
      'Kind',
    ];
    const rows = this.filteredData.map((item) => [
      item.id,
      item['beneficiary-name'],
      item.date instanceof Date ? item.date.toISOString().split('T')[0] : item.date,
      item.direction,
      item.amount,
      item.description,
      item.currency,
      item.mcc,
      item.kind,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows]
        .map((e) => e.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ✅ Dodato da build prođe
  onDateRangeSelected(event: any) {
    console.log('Date range selected:', event);
    // možeš ovde filtrirati po datumu ako budeš dodavala tu funkciju
  }

  // ✅ Dodato da build prođe
  onClearFilters() {
    console.log('Filters cleared');
    this.selectedKind = 'EXECUTED';
    this.currentPage = 1;
    this.updatePagination();
  }

  // ✅ Dodato da izvuče kategorije i podkategorije iz podataka
  extractCategoriesAndSubcategories(): void {
    const categorySet = new Set<string>();
    const subcategorySet = new Set<string>();

    for (const transaction of this.allTransactions) {
      if (transaction.category) {
        categorySet.add(transaction.category);
      }
      if (transaction.subcategory) {
        subcategorySet.add(transaction.subcategory);
      }
    }

    this.categories = Array.from(categorySet).sort();
    this.subcategories = Array.from(subcategorySet).sort();
  }
}
