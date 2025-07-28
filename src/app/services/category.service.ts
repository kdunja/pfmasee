import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Category {
  code: string | number;
  name: string;
  parentCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url = 'assets/categories.json'; 

  constructor(private http: HttpClient) {}

 getCategories(): Observable<Category[]> {
  return this.http.get<any[]>('assets/categories.json').pipe(
    map(data => data.map(item => ({
      code: item.code,
      name: item.name,
      parentCode: item['parent-code'] || ''
    })))
  );
}


  // Izdvajanje glavnih kategorija (parent-code je "")
  getMainCategories(categories: Category[]): Category[] {
    return categories.filter(cat => cat.parentCode === '');
  }

  // Izdvajanje podkategorija za datu glavnu kategoriju
  getSubcategories(categories: Category[], parentCode: string): Category[] {
    return categories.filter(cat => cat.parentCode === parentCode);
  }

  // Pronađi kategoriju po imenu (za automatsko mapiranje)
  findCategoryByKeyword(categories: Category[], keyword: string): Category | null {
    keyword = keyword.toLowerCase();
    return categories.find(cat => cat.name.toLowerCase().includes(keyword)) || null;
  }
}
