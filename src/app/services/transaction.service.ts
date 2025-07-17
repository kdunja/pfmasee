import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<any[]>([]);
  private transactions: any[] = [];

  addTransaction(tx: any) {
    this.transactions.push(tx);
    this.transactionsSubject.next(this.transactions);
  }

  getTransactions(): Observable<any[]> {
    return this.transactionsSubject.asObservable();
  }
}
