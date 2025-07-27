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

  view: [number, number] = [650, 300];
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
    name: 'Entertainment',
    value: 42.97,
    children: [
      {
        name: 'Music Streaming',
        value: 19.98,
        children: [
          { name: 'Spotify Monthly Subscription', value: 9.99 },
          { name: 'Apple Music', value: 9.99 }
        ]
      },
      {
        name: 'Video Streaming',
        value: 12.99,
        children: [
          { name: 'Netflix Plan', value: 12.99 }
        ]
      },
      {
        name: 'Clubbing',
        value: 20.0,
        children: [
          { name: 'Club Soho', value: 20.0 }
        ]
      },
      {
        name: 'Bars',
        value: 18.0,
        children: [
          { name: 'Bar Tab Mr Jack', value: 18.0 }
        ]
      }
    ]
  },
  {
    name: 'Bills & Utilities',
    value: 80.0,
    children: [
      {
        name: 'Electricity',
        value: 40.0,
        children: [
          { name: 'Electricity Bill', value: 40.0 }
        ]
      },
      {
        name: 'Water',
        value: 15.0,
        children: [
          { name: 'Water Supply Charge', value: 15.0 }
        ]
      },
      {
        name: 'Internet',
        value: 25.0,
        children: [
          { name: 'Internet Service', value: 25.0 }
        ]
      }
    ]
  },
  {
    name: 'Food & Drinks',
    value: 122.5,
    children: [
      {
        name: 'Restaurants',
        value: 35.0,
        children: [
          { name: 'Restaurant La Piazza', value: 35.0 }
        ]
      },
      {
        name: 'Groceries',
        value: 80.0,
        children: [
          { name: 'Grocery Store Lidl', value: 80.0 }
        ]
      },
      {
        name: 'Coffee',
        value: 7.5,
        children: [
          { name: 'Coffee Shop Starbucks', value: 4.0 },
          { name: 'Barista Cafe', value: 3.5 }
        ]
      }
    ]
  },
  {
    name: 'Health & Fitness',
    value: 44.5,
    children: [
      {
        name: 'Gym',
        value: 29.0,
        children: [
          { name: 'Gym Membership April', value: 29.0 }
        ]
      },
      {
        name: 'Medicine',
        value: 15.5,
        children: [
          { name: 'Pharmacy Purchase', value: 15.5 }
        ]
      }
    ]
  },
  {
    name: 'Mobile & Internet',
    value: 10.0,
    children: [
      {
        name: 'Mobile Top-up',
        value: 10.0,
        children: [
          { name: 'Top-up Mobile', value: 10.0 }
        ]
      }
    ]
  },
  {
    name: 'Education',
    value: 1514.99,
    children: [
      {
        name: 'Online Learning',
        value: 14.99,
        children: [
          { name: 'Online Course Udemy', value: 14.99 }
        ]
      },
      {
        name: 'Tuition',
        value: 1500.0,
        children: [
          { name: 'University Tuition', value: 1500.0 }
        ]
      }
    ]
  },
  {
    name: 'Transport',
    value: 28.5,
    children: [
      {
        name: 'Taxi',
        value: 6.0,
        children: [
          { name: 'Taxi Service', value: 6.0 }
        ]
      },
      {
        name: 'Public Transport',
        value: 15.0,
        children: [
          { name: 'Public Transport Card Reload', value: 15.0 }
        ]
      },
      {
        name: 'Ride Sharing',
        value: 7.5,
        children: [
          { name: 'Uber Ride', value: 7.5 }
        ]
      }
    ]
  },
  {
    name: 'Shopping & Services',
    value: 360.0,
    children: [
      {
        name: 'Hairdresser',
        value: 60.0,
        children: [
          { name: 'Hairdresser Cut & Color', value: 60.0 }
        ]
      },
      {
        name: 'Clothing',
        value: 100.0,
        children: [
          { name: 'Zara Clothing Purchase', value: 100.0 }
        ]
      },
      {
        name: 'Electronics',
        value: 200.0,
        children: [
          { name: 'Electronics Amazon', value: 200.0 }
        ]
      }
    ]
  },
  {
    name: 'Charity',
    value: 10.0,
    children: [
      {
        name: 'Donations',
        value: 10.0,
        children: [
          { name: 'Donation UNICEF', value: 10.0 }
        ]
      }
    ]
  },
  {
    name: 'Income',
    value: 2549.99,
    children: [
      {
        name: 'Salary',
        value: 2000.0,
        children: [
          { name: 'Salary Payment April', value: 2000.0 }
        ]
      },
      {
        name: 'Bank Transfer',
        value: 500.0,
        children: [
          { name: 'Bank Transfer Received', value: 500.0 }
        ]
      },
      {
        name: 'Refund',
        value: 49.99,
        children: [
          { name: 'Electricity Refund', value: 40.0 },
          { name: 'Spotify Refund', value: 9.99 }
        ]
      }
    ]
  },
  {
    name: 'Cash',
    value: 100.0,
    children: [
      {
        name: 'ATM',
        value: 100.0,
        children: [
          { name: 'ATM Withdrawal', value: 100.0 }
        ]
      }
    ]
  },
  {
    name: 'Professional Services',
    value: 1000.0,
    children: [
      {
        name: 'Consulting',
        value: 1000.0,
        children: [
          { name: 'Consulting Service Fee', value: 1000.0 }
        ]
      }
    ]
  },
  {
    name: 'Fees & Charges',
    value: 7.5,
    children: [
      {
        name: 'Bank Fee',
        value: 2.5,
        children: [
          { name: 'Service Fee Bank', value: 2.5 }
        ]
      },
      {
        name: 'Penalty',
        value: 5.0,
        children: [
          { name: 'Late Payment Charge', value: 5.0 }
        ]
      }
    ]
  },
  {
    name: 'Travel',
    value: 210.0,
    children: [
      {
        name: 'Accommodation',
        value: 120.0,
        children: [
          { name: 'Travel Booking Airbnb', value: 120.0 }
        ]
      },
      {
        name: 'Flight',
        value: 90.0,
        children: [
          { name: 'Airline Ticket WizzAir', value: 90.0 }
        ]
      }
    ]
  },
  {
    name: 'Pets',
    value: 55.0,
    children: [
      {
        name: 'Pet Food',
        value: 25.0,
        children: [
          { name: 'Pet Store Food', value: 25.0 }
        ]
      },
      {
        name: 'Vet',
        value: 30.0,
        children: [
          { name: 'Vet Appointment', value: 30.0 }
        ]
      }
    ]
  },
  {
    name: 'Business',
    value: 27.0,
    children: [
      {
        name: 'Hosting',
        value: 15.0,
        children: [
          { name: 'DigitalOcean Hosting', value: 15.0 }
        ]
      },
      {
        name: 'Domain Services',
        value: 12.0,
        children: [
          { name: 'Domain Renewal Namecheap', value: 12.0 }
        ]
      }
    ]
  },
  {
    name: 'Insurance',
    value: 100.0,
    children: [
      {
        name: 'Health Insurance',
        value: 100.0,
        children: [
          { name: 'Insurance Payment', value: 100.0 }
        ]
      }
    ]
  },
  {
    name: 'Debt',
    value: 450.0,
    children: [
      {
        name: 'Credit Card',
        value: 300.0,
        children: [
          { name: 'Credit Card Payment', value: 300.0 }
        ]
      },
      {
        name: 'Loan',
        value: 150.0,
        children: [
          { name: 'Loan Repayment', value: 150.0 }
        ]
      }
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

