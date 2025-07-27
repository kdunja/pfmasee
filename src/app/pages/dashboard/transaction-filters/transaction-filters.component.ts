import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-transaction-filters',
  templateUrl: './transaction-filters.component.html'
})
export class TransactionFiltersComponent {
  fromDate: Date | null = null;
  toDate: Date | null = null;

  @Output() dateRangeSelected = new EventEmitter<{ from: Date | null; to: Date | null }>();
  @Output() filterTransactions = new EventEmitter<void>();
  @Output() clearSelections = new EventEmitter<void>();

  onFilterClick() {
    this.dateRangeSelected.emit({ from: this.fromDate, to: this.toDate });
    this.filterTransactions.emit();
  }

  onClearClick() {
    this.fromDate = null;
    this.toDate = null;
    this.dateRangeSelected.emit({ from: null, to: null });
    this.clearSelections.emit();
  }
}
