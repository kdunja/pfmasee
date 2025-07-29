import { Component, HostListener, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

interface CategoryData {
  name: string;
  value: number;
  children?: CategoryData[];
}

@Component({
  selector: 'app-spending-charts',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './spending-charts.component.html',
})
export class SpendingChartsComponent implements OnInit, OnChanges {
  @Input() transactions: any[] = [];
  @Input() categories: { id: string; name: string }[] = [];
  @Input() subcategories: { id: string; name: string; categoryId: string }[] = [];
  @Input() dateRange: { from: Date | null; to: Date | null } | null = null;

  view: [number, number] = [730, 300];
  selectedChart: 'pie' | 'tree' = 'tree';
  currentRootCategory: string | null = null;
  showNoDataMessage: boolean = false;

  treeMapData: CategoryData[] = [];
  fullTreeData: CategoryData[] = [];

  private changesTimeout: any;
  debug = false;

  isMobile = false;
  isChartFullscreen = false;

  colorScheme = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FF6EC7', '#FFA500', '#FFE600', '#00C5CD', '#342F5C', '#7D3C98', '#00C49F'],
  };

  ngOnInit(): void {
    this.checkMobile();
  }

  ngOnChanges(): void {
    clearTimeout(this.changesTimeout);
    this.changesTimeout = setTimeout(() => {
      this.buildChartData();
    }, 200);
    this.checkMobile();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkMobile();
  }

  private checkMobile() {
    this.isMobile = window.innerWidth <= 500;
  }

  buildChartData(): void {
    const filteredTx = this.filterByDate(this.transactions).filter(
      (t) => t.type === 'expense' || !t.type
    );

    const data: CategoryData[] = [];

    for (const cat of this.categories) {
      const txInCat = filteredTx.filter((t) => {
        const sub = this.subcategories.find((s) => s.id === t.subcategoryId);
        return sub?.categoryId === cat.id;
      });

      const subcats = this.subcategories.filter((s) => s.categoryId === cat.id);

      const children: CategoryData[] = subcats
        .map((sub) => {
          const value = filteredTx
            .filter((t) => t.subcategoryId === sub.id)
            .reduce((sum, t) => sum + t.amount, 0);

          if (this.debug) {
            console.log('Subcategory:', sub.name, 'Value:', value);
          }

          return { name: sub.name, value };
        })
        .filter((c) => c.value > 0);

      const value = txInCat.reduce((sum, t) => sum + t.amount, 0);
      if (value > 0) {
        data.push({ name: cat.name, value, children });
      }
    }

    this.fullTreeData = data;

    if (this.currentRootCategory === null) {
      this.treeMapData = data;
      this.showNoDataMessage = data.length === 0;
    }
  }

  filterByDate(transactions: any[]): any[] {
    if (!this.dateRange?.from && !this.dateRange?.to) return transactions;

    return transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        (!this.dateRange?.from || date >= this.dateRange.from) &&
        (!this.dateRange?.to || date <= this.dateRange.to)
      );
    });
  }

  onCategorySelected(event: any): void {
    const clicked =
      this.fullTreeData.find((cat) => cat.name === event.name) ||
      this.treeMapData.find((cat) => cat.name === event.name);

    if (!clicked) return;

    if (clicked.children && clicked.children.length > 0) {
      this.treeMapData = clicked.children.map((child) => ({
        name: child.name,
        value: child.value,
      }));
      this.currentRootCategory = clicked.name;
      this.showNoDataMessage = false;
    } else {
      this.treeMapData = [];
      this.currentRootCategory = clicked.name;
      this.showNoDataMessage = true;
    }
  }

  goBackToMainTree(): void {
    this.treeMapData = this.fullTreeData;
    this.currentRootCategory = null;
    this.showNoDataMessage = this.treeMapData.length === 0;
  }

  get pieData() {
    return this.fullTreeData.map((cat) => ({
      name: cat.name,
      value: cat.value ?? 0,
    }));
  }

  onChartSliceSelected(event: any): void {
    const clicked =
      this.fullTreeData.find((cat) => cat.name === event.name) ||
      this.treeMapData.find((cat) => cat.name === event.name);

    if (!clicked) return;

    const childrenExist = Array.isArray(clicked.children) && clicked.children.length > 0;

    if (childrenExist) {
      this.treeMapData = (clicked.children ?? []).map((child) => ({
        name: child.name,
        value: child.value,
      }));
      this.currentRootCategory = clicked.name;
      this.showNoDataMessage = false;
    } else {
      this.treeMapData = [];
      this.currentRootCategory = clicked.name;
      this.showNoDataMessage = true;
    }
  }

  goBackToMainPie(): void {
    this.currentRootCategory = null;
    this.showNoDataMessage = false;
  }

  enterFullscreenChart(mode: 'pie' | 'tree') {
    this.selectedChart = mode;
    this.isChartFullscreen = true;
  }

  exitFullscreenChart() {
    this.isChartFullscreen = false;
    this.goBackToMainTree();
    this.goBackToMainPie();
  }
}

