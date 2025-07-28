import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartComponent } from 'ng-apexcharts';
import { CategoryService, Category } from 'src/app/services/category.service';

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

  selectedFromDate: Date | null = null;
  selectedToDate: Date | null = null;

  currentPage: number = 1;
  pageSize: number = 7;
  totalPages: number = 1;

  allTransactions: any[] = [];
  paginatedData: any[] = [];

  categories: { id: number; name: string }[] = [];
  subcategories: { id: number; name: string; categoryId: number }[] = [];

  readonly kindGroupMap: { [key: string]: string } = {
    pmt: 'EXECUTED',
    fee: 'FUTURE',
    wdw: 'EXECUTED',
    sal: 'EXECUTED',
    dep: 'FUTURE',
    trf: 'PENDING',
  };

  constructor(private http: HttpClient, private categoryService: CategoryService) {}

  ngOnInit() {
    console.log('Loaded categories:', this.categories);
console.log('Loaded subcategories:', this.subcategories);
    this.http.get<any[]>('assets/transactions.json').subscribe((data) => {
      this.allTransactions = data.map((t) => ({
        ...t,
        date: new Date(t.date),
      }));

      this.loadCategoriesFromJson();
      this.updatePagination();
    });
  }

  loadCategoriesFromJson(): void {
    this.categoryService.getCategories().subscribe((data: Category[]) => {
      const main = data.filter(c => c.parentCode === '');
      const sub = data
        .filter(c => c.parentCode !== '')
        .map((c, index) => ({
          id: index + 100, // možeš koristiti c.code ako su brojevi
          name: c.name,
          categoryId: this.getCategoryIdFromCode(main, c.parentCode)
        }));

      this.categories = main.map((cat, i) => ({
        id: i + 1, // možeš koristiti cat.code ako su brojevi
        name: cat.name
      }));

      this.subcategories = sub;
    });
  }

  getCategoryIdFromCode(mainCategories: Category[], parentCode: string): number {
    const index = mainCategories.findIndex(c => c.code === parentCode);
    return index !== -1 ? index + 1 : -1;
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
      data = data.filter(t => this.kindGroupMap[t.kind] === this.selectedKind);
    }

    if (this.selectedFromDate) {
      data = data.filter(t => new Date(t.date) >= this.selectedFromDate!);
    }

    if (this.selectedToDate) {
      data = data.filter(t => new Date(t.date) <= this.selectedToDate!);
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

  onDateRangeSelected(event: { from: Date | null; to: Date | null }) {
    this.selectedFromDate = event.from;
    this.selectedToDate = event.to;
    this.updatePagination();
  }

  onClearFilters() {
    this.selectedFromDate = null;
    this.selectedToDate = null;
    this.updatePagination();
  }
}
