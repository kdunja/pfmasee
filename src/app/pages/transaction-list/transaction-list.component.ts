import { Component } from '@angular/core';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent {
  displayedColumns: string[] = ['assigned', 'name', 'priority', 'budget'];

  dataSource = [
    {
      beneficiary: 'Ana Petrović',
      date: '2025-07-15',
      amount: 4600,
      currency: 'EUR',
      imagePath: 'assets/images/users/2.jpg'
    },
    {
      beneficiary: 'Marko Jovanović',
      date: '2025-07-14',
      amount: 1200,
      currency: 'USD',
      imagePath: 'assets/images/users/3.jpg'
    },
    {
      beneficiary: 'Jelena Kostić',
      date: '2025-07-17',
      amount: 2800,
      currency: 'RSD',
      imagePath: 'assets/images/users/1.jpg'
    }
  ];
}
