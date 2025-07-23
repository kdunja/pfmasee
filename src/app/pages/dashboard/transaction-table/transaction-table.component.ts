import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html'
})
export class TransactionTableComponent {
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Output() splitTransaction = new EventEmitter<any>();

  showCategoryModal = false;
  selectedTransaction: any = null;

  // Dummy liste kategorija i podkategorija
  categories = [
    { id: 1, name: 'Food & Drinks' },
    { id: 2, name: 'Night-life' },
    { id: 3, name: 'Mobile phone' }
  ];

  subcategories = [
    { id: 1, categoryId: 1, name: 'Restaurants' },
    { id: 2, categoryId: 1, name: 'Cafes' },
    { id: 3, categoryId: 2, name: 'Bars' },
    { id: 4, categoryId: 2, name: 'Clubs' },
    { id: 5, categoryId: 3, name: 'Top-up' }
  ];

  // Selektovane vrednosti (veza sa ngModel)
  selectedCategoryId: number | null = null;
  selectedSubcategoryId: number | null = null;

  get filteredSubcategories() {
    if (!this.selectedCategoryId) {
      return [];
    }
    return this.subcategories.filter(sc => sc.categoryId === this.selectedCategoryId);
  }

  getCategoryName(categoryId: number | null): string | null {
  if (!categoryId) return null;
  const cat = this.categories.find(c => c.id === categoryId);
  return cat ? cat.name : null;
}

  onSplitTransaction(item: any) {
    this.splitTransaction.emit(item);
  }

  openCategoryModal(element: any): void {
    this.selectedTransaction = element;
    this.showCategoryModal = true;

    // Preselektuj postojeću kategoriju i podkategoriju ako ih ima
    this.selectedCategoryId = element.categoryId || null;
    this.selectedSubcategoryId = element.subcategoryId || null;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.selectedTransaction = null;
    this.selectedCategoryId = null;
    this.selectedSubcategoryId = null;
  }

  applyCategory(): void {
    if (this.selectedTransaction) {
      this.selectedTransaction.categoryId = this.selectedCategoryId;
      this.selectedTransaction.subcategoryId = this.selectedSubcategoryId;
    }
    alert('Kategorija primenjena!');
    this.closeCategoryModal();
  }
}
