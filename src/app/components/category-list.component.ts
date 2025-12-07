import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-category-list',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Categories</h2>
      <div>
        <a *ngIf="isAdmin" class="btn btn-primary" routerLink="/categories/add">Add Category</a>
      </div>
    </div>

    <div *ngFor="let c of categories" class="mb-3">
      <div class="card">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-bold">{{c.name}}</div>
            <div class="text-muted">{{c.description}}</div>
          </div>
          <div class="d-flex gap-2">
            <a *ngIf="isAdmin" class="btn btn-outline-secondary btn-sm" [routerLink]="['/categories/edit', c.id]">Edit</a>
            <button *ngIf="isAdmin" class="btn btn-outline-danger btn-sm" (click)="remove(c.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CategoryListComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  categories: any[] = [];

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.api.getCategories().subscribe(data => (this.categories = data));
  }

  remove(id?: number) {
    if (!id) return;
    if (!confirm('Delete this category?')) return;
    this.api.deleteCategory(id).subscribe(() => this.load());
  }

  get isAuth() {
    return this.auth.isAuthenticated();
  }

  get isAdmin() {
    return this.auth.isAdmin();
  }
}
