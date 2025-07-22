import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-export-pagination',
  templateUrl: './export-pagination.component.html'
})
export class ExportPaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.pageChange.emit(page);
  }

  get pageButtons(): number[] {
    // Prikazuje max 5 brojeva oko currentPage, plus prve i zadnje
    const range: number[] = [];
    if (this.totalPages <= 7) {
      for (let i = 1; i <= this.totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (this.currentPage > 4) range.push(-1); // ... marker
      for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(this.totalPages - 1, this.currentPage + 1); i++)
        range.push(i);
      if (this.currentPage < this.totalPages - 3) range.push(-1); // ... marker
      range.push(this.totalPages);
    }
    return range;
  }
}

