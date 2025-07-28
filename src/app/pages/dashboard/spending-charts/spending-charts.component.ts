import { Component, Input } from '@angular/core';
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
  templateUrl: './spending-charts.component.html'
})
export class SpendingChartsComponent {
  @Input() transactions: any[] = [];
  @Input() categories: string[] = [];
  @Input() subcategories: string[] = [];

  view: [number, number] = [730, 300];
  selectedChart: 'pie' | 'tree' = 'tree';
  currentRootCategory: string | null = null;
  showNoDataMessage: boolean = false;

  colorScheme = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FF6EC7', '#FFA500', '#FFE600', '#00C5CD', '#342F5C', '#7D3C98', '#00C49F']
  };

  allTreeData: CategoryData[] = [
  {
    name: 'Housing',
    value: 2300,
    children: [
      {
        name: 'Rent',
        value: 1800,
      },
      {
        name: 'Utilities',
        value: 300,
      },
      {
        name: 'Maintance',
        value: 200,
      },
     
    ]
  },
  {
    name: 'Transportation',
    value: 245,
    children: [
      {
        name: 'Fuel',
        value: 120,
      },
      {
        name: 'Public transport',
        value: 75,
      },
      {
        name: 'Taxi',
        value: 50,
      }
    ]
  },
  {
    name: 'Food & Drinks',
    value: 420,
    children: [
      {
        name: 'Groceries',
        value: 250,
      },
      {
        name: 'Restaurants',
        value: 120,
      },
      {
        name: 'Coffee',
        value: 50,
      }
    ]
  },
  {
    name: 'Health & Fitness',
    value: 280,
    children: [
      {
        name: 'Doctor',
        value: 100,
      },
      {
        name: 'Pharmacy',
        value: 80,
      },
      {
        name: 'Gym',
        value: 100,
      },
      
    ]
  },
  {
    name: 'Entertainment',
    value: 180,
    children: [
      {
        name: 'Movies',
        value: 60,
      },
      {
        name: 'Games',
        value: 70,
      },
      {
        name: 'Streaming',
        value: 50,
      },
    ]
  },
  {
    name: 'Shopping',
    value: 390,
    children: [
      {
        name: 'Clothing',
        value: 150,
      },
      {
        name: 'Electronics',
        value: 200,
      },
      {
        name: 'Online',
        value: 40,
      },
    ]
  },
   {
    name: 'Education',
    value: 1900,
    children: [
      { name: 'Tuition', value: 1500 },
      { name: 'Books', value: 100 },
      { name: 'Courses', value: 300 }
    ]
  },
  {
    name: 'Travel',
    value: 320,
    children: [
      { name: 'Hotel', value: 120 },
      { name: 'Flights', value: 150 },
      { name: 'Tickets', value: 50 }
    ]
  },
  {
    name: 'Income',
    value: 3150,
    children: [
      { name: 'Salary', value: 2500 },
      { name: 'Freelance', value: 300 },
      { name: 'Investments', value: 350 }
    ]
  },
  {
    name: 'Other',
    value: 240,
    children: [
      { name: 'Miscellaneous', value: 100 },
      { name: 'Donations', value: 90 },
      { name: 'Gifts', value: 50 }
    ]
  }
];

  treeMapData: CategoryData[] = [];

  constructor() {
    this.computeValues(this.allTreeData);
    this.treeMapData = this.allTreeData;
  }

  computeValues(data: CategoryData[]): number {
    return data.reduce((total, item) => {
      if (item.children && item.children.length > 0) {
        item.value = this.computeValues(item.children);
      }
      return total + (item.value ?? 0);
    }, 0);
  }

  get pieData() {
    return this.allTreeData.map(cat => ({
      name: cat.name,
      value: cat.value ?? 0
    }));
  }

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