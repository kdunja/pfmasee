import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

interface CategoryData {
  name: string;
  value: number;
  children?: { name: string; value: number }[];
}

@Component({
  selector: 'app-spending-charts',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './spending-charts.component.html'
})
export class SpendingChartsComponent {
  view: [number, number] = [700, 300];
  selectedChart: 'pie' | 'tree' = 'tree'; // Početni je tree

  currentRootCategory: string | null = null;
  showNoDataMessage: boolean = false;

  colorScheme = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5B88B2', '#2C365A', '#7EC641', '#FF6600', '#666666']
  };

  pieData = [
    { name: 'Bills & Utilities', value: 650340 },
    { name: 'Shopping & Services', value: 300740 },
    { name: 'Food & Dining', value: 250340 },
    { name: 'Fees & Charges', value: 83472 },
    { name: 'Pets', value: 81272 }
  ];

  allTreeData: CategoryData[] = [
    {
      name: 'Bills & Utilities',
      value: 650340,
      children: [
        { name: 'Electricity', value: 300000 },
        { name: 'Water', value: 200000 },
        { name: 'Internet', value: 150340 }
      ]
    },
    {
      name: 'Shopping & Services',
      value: 300740,
      children: [
        { name: 'Clothing', value: 120000 },
        { name: 'Electronics', value: 100000 },
        { name: 'Hairdresser', value: 80740 }
      ]
    },
    {
      name: 'Food & Dining',
      value: 250340,
      children: [
        { name: 'Groceries', value: 180000 },
        { name: 'Restaurants', value: 70340 }
      ]
    },
    {
      name: 'Fees & Charges',
      value: 83472
    },
    {
      name: 'Pets',
      value: 81272
    }
  ];

  treeMapData = this.allTreeData;

  onCategorySelected(event: any): void {
    const clicked = this.allTreeData.find(cat => cat.name === event.name);
    if (clicked && clicked.children) {
      this.treeMapData = clicked.children;
      this.currentRootCategory = clicked.name;
      this.showNoDataMessage = false;
    } else {
      this.treeMapData = [];
      this.currentRootCategory = event.name;
      this.showNoDataMessage = true;
    }
  }

  goBackToMainTree(): void {
    this.treeMapData = this.allTreeData;
    this.currentRootCategory = null;
    this.showNoDataMessage = false;
  }
}
