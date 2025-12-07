import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Category } from '../models/category';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/products/${id}`);
  }

  createProduct(p: Product): Observable<Product> {
    return this.http.post<Product>(`${this.base}/products`, p);
  }

  updateProduct(id: number, p: Product): Observable<Product> {
    return this.http.put<Product>(`${this.base}/products/${id}`, p);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.base}/products/${id}`);
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.base}/categories/${id}`);
  }

  createCategory(c: Category): Observable<Category> {
    return this.http.post<Category>(`${this.base}/categories`, c);
  }

  updateCategory(id: number, c: Category): Observable<Category> {
    return this.http.put<Category>(`${this.base}/categories/${id}`, c);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.base}/categories/${id}`);
  }

  // Auth (mocked)
  login(username: string, password: string) {
    return this.http.get<any[]>(`${this.base}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/users`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.base}/users`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/users/${id}`);
  }

  // Interactions
  getInteractions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/interactions`);
  }

  addInteraction(interaction: any): Observable<any> {
    return this.http.post<any>(`${this.base}/interactions`, interaction);
  }

  deleteInteraction(id: number) {
    return this.http.delete(`${this.base}/interactions/${id}`);
  }
}
