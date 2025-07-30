import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-transaction-filters',
  templateUrl: './transaction-filters.component.html'
})
export class TransactionFiltersComponent {
  fromDate: Date | null = null;
  toDate: Date | null = null;

  @Input() kinds: string[] = [];

  @Output() dateRangeSelected = new EventEmitter<{ from: Date | null; to: Date | null }>();
  @Output() filterTransactions = new EventEmitter<void>();
  @Output() clearSelections = new EventEmitter<void>();
  @Output() kindFilterChanged = new EventEmitter<string | null>();
  selectedKind: string | null = null;

  onKindChange() {
    this.kindFilterChanged.emit(this.selectedKind);
  }


  onFilterClick() {
    this.dateRangeSelected.emit({ from: this.fromDate, to: this.toDate });
    this.filterTransactions.emit();
  }

  onClearClick() {
  this.fromDate = null;
  this.toDate = null;
  this.selectedKind = null; 
  this.dateRangeSelected.emit({ from: null, to: null });
  this.kindFilterChanged.emit(null); 
  this.clearSelections.emit();
}
}
