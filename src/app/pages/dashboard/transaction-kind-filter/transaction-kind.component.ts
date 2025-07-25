import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-transaction-kind-filter',
  templateUrl: './transaction-kind.component.html'
})
export class TransactionKindFilterComponent {
  @Input() kinds: string[] = [];
  @Input() selectedKind: string = '';
  @Output() kindSelected = new EventEmitter<string>();

  selectKind(kind: string) {
    this.kindSelected.emit(kind);
  }
}
