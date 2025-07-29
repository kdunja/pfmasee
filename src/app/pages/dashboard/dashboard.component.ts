import { Component, ViewEncapsulation, ViewChild, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartComponent } from 'ng-apexcharts';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppDashboardComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  displayedColumns: string[] = ['beneficiary', 'date', 'amount', 'description'];
  selectedTab: string = 'overview';

  selectedFromDate: Date | null = null;
  selectedToDate: Date | null = null;
  selectedKindFromFilter: string | null = null;
  dateFilterManuallySet: boolean = false;

  currentPage: number = 1;
  pageSize: number = 7;
  totalPages: number = 1;

  allTransactions: any[] = [];
  paginatedData: any[] = [];

  categories: { id: string; name: string }[] = [];
  subcategories: { id: string; name: string; categoryId: string }[] = [];

  availableKinds: string[] = [];

  // Responsive dodatak
  showMobileOverlay: boolean = false;
  isMobileView: boolean = false;

  constructor(private http: HttpClient, private categoryService: CategoryService) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobileView = event.target.innerWidth <= 768;
  }

  ngOnInit() {
    this.isMobileView = window.innerWidth <= 768;

    const savedCats = localStorage.getItem('categories');
    const savedSubcats = localStorage.getItem('subcategories');
    const savedTx = localStorage.getItem('transactions');

    if (savedCats && savedCats !== '[]' && savedSubcats && savedTx) {
      this.categories = JSON.parse(savedCats);
      this.subcategories = JSON.parse(savedSubcats);
      this.allTransactions = JSON.parse(savedTx).map((t: any) => ({
        ...t,
        date: new Date(t.date),
        amount: parseFloat((t.amount || '0').toString()),
        subcategoryId: t.subcategoryId?.toString() ?? null,
        categoryId: t.categoryId ?? null,
      }));

      // Default za CHART — jul 2025
      this.selectedFromDate = new Date('2025-07-01');
      this.selectedToDate = new Date('2025-07-31');

      this.extractKinds();
      this.updatePagination();
      return;
    }

    this.http.get<any[]>('assets/categories.json').subscribe((data) => {
      const main = data.filter(c => c["parent-code"] === '');
      const sub = data.filter(c => c["parent-code"] !== '');

      this.categories = main.map((cat) => ({
        id: cat.code.toString(),
        name: cat.name
      }));

      this.subcategories = sub.map((subcat) => ({
        id: subcat.code.toString(),
        name: subcat.name,
        categoryId: subcat["parent-code"]
      }));

      this.http.get<any[]>('assets/transactions.json').subscribe((data) => {
        this.allTransactions = data.map((t) => {
          const sub = this.subcategories.find(s => s.id === t.subcategoryId?.toString());
          return {
            ...t,
            date: new Date(t.date),
            amount: parseFloat((t.amount || '0').toString().replace(/,/g, '')),
            categoryId: sub ? sub.categoryId : t.categoryId ?? null,
            subcategoryId: t.subcategoryId?.toString() ?? null
          };
        });

        localStorage.setItem('categories', JSON.stringify(this.categories));
        localStorage.setItem('subcategories', JSON.stringify(this.subcategories));
        localStorage.setItem('transactions', JSON.stringify(this.allTransactions));

        // Default za CHART — jul 2025
        this.selectedFromDate = new Date('2025-07-01');
        this.selectedToDate = new Date('2025-07-31');

        this.extractKinds();
        this.updatePagination();
      });
    });
  }

  resetLocalStorage() {
    localStorage.removeItem('categories');
    localStorage.removeItem('subcategories');
    localStorage.removeItem('transactions');
    window.location.reload();
  }

  findCategoryIdByName(name: string): string | null {
    const cat = this.categories.find(c => c.name === name);
    return cat ? cat.id : null;
  }

  findSubcategoryIdByName(name: string): string | null {
    const sub = this.subcategories.find(sc => sc.name === name);
    return sub ? sub.id : null;
  }

  setSelectedTab(tab: string): void {
  this.selectedTab = tab;
  this.closeMobileOverlay(); 
}


  get filteredData(): any[] {
    let data = this.allTransactions;

    if (this.dateFilterManuallySet) {
      if (this.selectedFromDate) {
        data = data.filter(t => new Date(t.date) >= this.selectedFromDate!);
      }

      if (this.selectedToDate) {
        data = data.filter(t => new Date(t.date) <= this.selectedToDate!);
      }
    }

    if (this.selectedKindFromFilter) {
      data = data.filter(t => t.kind === this.selectedKindFromFilter);
    }

    return data.sort((a, b) => {
      const dateDiff = b.date.getTime() - a.date.getTime();
      if (dateDiff !== 0) return dateDiff;
      if (!a.categoryId) return 1;
      if (!b.categoryId) return -1;
      return a.categoryId.localeCompare(b.categoryId);
    });
  }

  get chartFilteredData(): any[] {
    let data = this.allTransactions;

    if (this.selectedFromDate) {
      data = data.filter(t => new Date(t.date) >= this.selectedFromDate!);
    }

    if (this.selectedToDate) {
      data = data.filter(t => new Date(t.date) <= this.selectedToDate!);
    }

    return data;
  }

  onKindFilterChanged(kind: string | null) {
    this.selectedKindFromFilter = kind;
    this.closeMobileOverlay();
    this.updatePagination();
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
      'ID', 'Beneficiary', 'Datum', 'Smer', 'Iznos', 'Opis', 'Valuta', 'MCC', 'Kind',
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
    this.dateFilterManuallySet = true;
    this.closeMobileOverlay();
    this.updatePagination();
  }

  onClearFilters() {
    this.selectedFromDate = null;
    this.selectedToDate = null;
    this.selectedKindFromFilter = null;
    this.dateFilterManuallySet = false;
    this.updatePagination();
  }

  extractKinds() {
    const kindsSet = new Set(this.allTransactions.map(t => t.kind));
    this.availableKinds = Array.from(kindsSet);
  }

  toggleMobileOverlay() {
    this.showMobileOverlay = !this.showMobileOverlay;
  }

  closeMobileOverlay() {
    this.showMobileOverlay = false;
  }
}
