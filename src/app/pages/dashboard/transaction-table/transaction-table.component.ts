import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html'
})
export class TransactionTableComponent implements OnInit, OnChanges {
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() categories: any[] = [];
  @Input() subcategories: any[] = [];
  @Output() splitTransaction = new EventEmitter<any>();

  isMobileView: boolean = false;

  showCategoryModal = false;
  selectedTransaction: any = null;
  multiSelectMode = false;
  selectedTransactionIds: number[] = [];

  selectedCategoryId: number | null = null;
  selectedSubcategoryId: number | null = null;

  activeActionId: string | null = null;

  categoryKeywordMap: { [key: string]: string } = {
    'glovo': 'Food & Dining',
    'wolt': 'Food & Dining',
    'gift': 'Gifts & Donations',
    'adobe': 'Shopping',
    'gym': 'Health & Fitness',
    'parking': 'Auto & Transport',
    'fit': 'Health & Fitness',
    'spa': 'Personal Care'
  };

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe(result => {
      this.isMobileView = result.matches;
    });
  }

  ngOnChanges(): void {
    this.autoCategorizeAll();
  }

  autoCategorizeAll(): void {
    if (!this.dataSource?.length || !this.categories?.length) return;

    for (const tx of this.dataSource) {
      if (!tx.categoryId) {
        const categoryName = this.getCategoryFromDescription(tx.description);
        const matchedCategory = this.categories.find(c => c.name === categoryName);
        if (matchedCategory) {
          tx.categoryId = matchedCategory.id;
        }
      }
    }
  }

  getCategoryFromDescription(description: string): string | null {
    const lowerDesc = description.toLowerCase();
    for (const keyword in this.categoryKeywordMap) {
      if (lowerDesc.includes(keyword)) {
        return this.categoryKeywordMap[keyword];
      }
    }
    return null;
  }

  assignAutoCategory(transaction: any): void {
    const categoryName = this.getCategoryFromDescription(transaction.description);
    const matchedCategory = this.categories.find(c => c.name === categoryName);
    if (matchedCategory) {
      transaction.categoryId = matchedCategory.id;
      transaction.subcategoryId = null;
    } else {
      alert(`No matching category for "${transaction.description}"`);
    }
  }

  get filteredSubcategories() {
    if (!this.selectedCategoryId) return [];
    return this.subcategories.filter(sc => sc.categoryId === this.selectedCategoryId);
  }

  getCategoryName(categoryId: number | null): string | null {
    if (!categoryId) return null;
    const cat = this.categories.find(c => c.id === categoryId);
    return cat ? cat.name : null;
  }

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
    for (const part of this.splitParts) {
      const newTx = {
        ...this.splitOriginal,
        categoryId: part.categoryId,
        subcategoryId: part.subcategoryId,
        amount: part.amount,
        isSplit: false,
        isPartOfSplit: true,              
        parentId: this.splitOriginal.id,
        id: Math.floor(Math.random() * 10000000)
      };
      this.dataSource.push(newTx);
    }
    this.splitOriginal.isSplit = true;
    this.closeSplitModal();
  }

  getSplitCategories(parentId: number): string[] {
    const children = this.dataSource.filter(t => t.parentId === parentId);
    const names: string[] = [];

    for (const child of children) {
      const category = this.categories.find(c => c.id === child.categoryId);
      if (category && !names.includes(category.name)) {
        names.push(category.name);
      }
    }

    return names;
  }

  onSplitTransaction(item: any) {
    this.openSplitModal(item);
  }

  openCategoryModal(element: any): void {
    if (this.multiSelectMode) return;

    this.selectedTransaction = element;
    this.showCategoryModal = true;
    this.selectedCategoryId = element.categoryId || null;
    this.selectedSubcategoryId = element.subcategoryId || null;
  }

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
    this.selectedTransaction = null;
    this.showCategoryModal = true;
    this.selectedCategoryId = null;
    this.selectedSubcategoryId = null;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.selectedTransaction = null;
    this.selectedCategoryId = null;
    this.selectedSubcategoryId = null;
  }

  applyCategory(): void {
    if (this.multiSelectMode && this.selectedTransactionIds.length > 0) {
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
  toggleMobileActions(element: any): void {
  element.showMobileActions = !element.showMobileActions;
}

toggleActionsFor(id: string): void {
  this.activeActionId = this.activeActionId === id ? null : id;
}

}
