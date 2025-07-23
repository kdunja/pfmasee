import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html'
})
export class TransactionTableComponent {
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Output() splitTransaction = new EventEmitter<any>();

  // --- Single/Multi select kategorisanje ---
  showCategoryModal = false;
  selectedTransaction: any = null;   // za single
  multiSelectMode = false;
  selectedTransactionIds: number[] = []; // za multi

  // Kategorije i podkategorije
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

  // Selekcija iz dropdowna (koristi se i za single i za multi)
  selectedCategoryId: number | null = null;
  selectedSubcategoryId: number | null = null;

  // --- GETTER za filtrirane podkategorije ---
  get filteredSubcategories() {
    if (!this.selectedCategoryId) {
      return [];
    }
    return this.subcategories.filter(sc => sc.categoryId === this.selectedCategoryId);
  }

  // --- Vrati ime kategorije iz id-ja (za prikaz u tabeli) ---
  getCategoryName(categoryId: number | null): string | null {
    if (!categoryId) return null;
    const cat = this.categories.find(c => c.id === categoryId);
    return cat ? cat.name : null;
  }

  // --- SPLIT ---
  onSplitTransaction(item: any) {
    this.splitTransaction.emit(item);
  }

  // --- SINGLE kategorisanje ---
  openCategoryModal(element: any): void {
    // Onemogući otvaranje ako je multi-select aktivan!
    if (this.multiSelectMode) return;
    this.selectedTransaction = element;
    this.showCategoryModal = true;
    this.selectedCategoryId = element.categoryId || null;
    this.selectedSubcategoryId = element.subcategoryId || null;
  }

  // --- MULTI kategorisanje ---
  startMultiSelect() {
    this.multiSelectMode = true;
    this.selectedTransactionIds = [];
  }

  cancelMultiSelect() {
    this.multiSelectMode = false;
    this.selectedTransactionIds = [];
    this.closeCategoryModal();
  }

  toggleTransactionSelection(id: number) {
    const idx = this.selectedTransactionIds.indexOf(id);
    if (idx >= 0) {
      this.selectedTransactionIds.splice(idx, 1);
    } else {
      this.selectedTransactionIds.push(id);
    }
  }

  proceedMultiCategorization() {
    this.selectedTransaction = null; // neće se koristiti u multi
    this.showCategoryModal = true;
    // Nema smisla preselektovati jednu vrednost, možeš ostaviti prazno ili izabrati prvu
    this.selectedCategoryId = null;
    this.selectedSubcategoryId = null;
  }

  // --- Modal zatvaranje ---
  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.selectedTransaction = null;
    this.selectedCategoryId = null;
    this.selectedSubcategoryId = null;
  }

  // --- APPLY kategorija (single i multi) ---
  applyCategory(): void {
    if (this.multiSelectMode && this.selectedTransactionIds.length > 0) {
      // Za svaku selektovanu transakciju dodeli novu kategoriju/podkategoriju
      for (const id of this.selectedTransactionIds) {
        const tx = this.dataSource.find(tr => tr.id === id);
        if (tx) {
          tx.categoryId = this.selectedCategoryId;
          tx.subcategoryId = this.selectedSubcategoryId;
        }
      }
      // Opcionalno: neki feedback (npr. alert)
      // alert('Kategorija primenjena na selektovane transakcije!');
      this.cancelMultiSelect(); // Zatvori modal i resetuj multi
    } else if (this.selectedTransaction) {
      this.selectedTransaction.categoryId = this.selectedCategoryId;
      this.selectedTransaction.subcategoryId = this.selectedSubcategoryId;
      // alert('Kategorija primenjena!');
      this.closeCategoryModal();
    } else {
      this.closeCategoryModal();
    }
  }
}
