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

  // --- SPLIT TRANSACTION MODAL ---
  splitModalOpen = false;
  splitOriginal: any = null;
  splitParts: {
    categoryId: number | null,
    subcategoryId: number | null,
    amount: number | null
  }[] = [];

  openSplitModal(transaction: any) {
    this.splitModalOpen = true;
    this.splitOriginal = transaction;
    // Inicijalizuj 2 splita sa praznim vrednostima
    this.splitParts = [
      { categoryId: null, subcategoryId: null, amount: null },
      { categoryId: null, subcategoryId: null, amount: null }
    ];
  }

  closeSplitModal() {
    this.splitModalOpen = false;
    this.splitOriginal = null;
    this.splitParts = [];
  }

  addSplitPart() {
    this.splitParts.push({ categoryId: null, subcategoryId: null, amount: null });
  }

  getFilteredSplitSubcategories(categoryId: number | null) {
  if (!categoryId) return [];
  return this.subcategories.filter(s => s.categoryId === categoryId);
}


  removeSplitPart(index: number) {
    if (this.splitParts.length > 2) {
      this.splitParts.splice(index, 1);
    }
  }

  splitSum(): number {
    return this.splitParts.reduce((sum, part) => sum + (Number(part.amount) || 0), 0);
  }

  applySplit() {
    if (!this.splitOriginal) return;
    // Kreiraj novu transakciju za svaki split
    for (const part of this.splitParts) {
      const newTx = {
        ...this.splitOriginal,
        categoryId: part.categoryId,
        subcategoryId: part.subcategoryId,
        amount: part.amount,
        isSplit: false,
        id: Math.floor(Math.random() * 10000000) // (dummy id)
      };
      this.dataSource.push(newTx);
    }
    this.splitOriginal.isSplit = true;
    this.closeSplitModal();
  }

  // --- SPLIT (staro, sad se koristi openSplitModal umesto onSplitTransaction) ---
  onSplitTransaction(item: any) {
    this.openSplitModal(item);
  }

  // --- SINGLE kategorisanje ---
  openCategoryModal(element: any): void {
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
      this.cancelMultiSelect();
    } else if (this.selectedTransaction) {
      this.selectedTransaction.categoryId = this.selectedCategoryId;
      this.selectedTransaction.subcategoryId = this.selectedSubcategoryId;
      this.closeCategoryModal();
    } else {
      this.closeCategoryModal();
    }
  }
}
