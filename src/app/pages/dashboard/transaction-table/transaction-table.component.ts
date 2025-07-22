import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html'
})
export class TransactionTableComponent {
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];

  @Output() splitTransaction = new EventEmitter<any>();

  onSplitTransaction(item: any) {
    this.splitTransaction.emit(item);
  }
}
