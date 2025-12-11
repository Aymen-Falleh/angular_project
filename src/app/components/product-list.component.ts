import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule],
  template: `
      <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Products</h2>
      <div>
        <a *ngIf="isAdmin" class="btn btn-primary" routerLink="/products/add">Add Product</a>
      </div>
    </div>

    <div *ngIf="filterCategoryId" class="alert alert-info d-flex justify-content-between align-items-center mb-3">
      <span>Showing products in category: <strong>{{ getCategoryName(filterCategoryId) }}</strong></span>
      <button class="btn btn-sm btn-outline-secondary" (click)="clearFilter()">Show All</button>
    </div>

    <div *ngFor="let p of filteredProducts" class="mb-3">
      <div class="card">
        <div class="card-body d-flex gap-3 align-items-center">
          <img *ngIf="p.image" [src]="p.image" alt="img" class="rounded" style="width:80px;height:80px;object-fit:cover" />
          <div class="flex-grow-1">
            <div class="fw-bold">{{p.name}}</div>
            <div class="text-muted">{{p.description}}</div>
            <div class="text-muted small">Category: {{ getCategoryName(p.categoryId) }}</div>
            <div class="mt-2">Price: {{p.price | currency}}</div>
          </div>
            <div class="d-flex flex-column gap-2">
            <a class="btn btn-outline-primary btn-sm" [routerLink]="['/products', p.id]">View</a>
            
            <div *ngIf="isAuth && !isAdmin" class="d-flex gap-2">
              <button class="btn btn-sm" 
                [class.btn-success]="getUserInteraction(p.id)?.type === 'like'"
                [class.btn-outline-success]="getUserInteraction(p.id)?.type !== 'like'"
                (click)="toggleInteraction(p.id, 'like')">
                👍 {{ getLikes(p.id) }}
              </button>
              <button class="btn btn-sm" 
                [class.btn-danger]="getUserInteraction(p.id)?.type === 'dislike'"
                [class.btn-outline-danger]="getUserInteraction(p.id)?.type !== 'dislike'"
                (click)="toggleInteraction(p.id, 'dislike')">
                👎 {{ getDislikes(p.id) }}
              </button>
            </div>

            <a *ngIf="isAdmin" class="btn btn-outline-secondary btn-sm" [routerLink]="['/products/edit', p.id]">Edit</a>
            <button *ngIf="isAdmin" class="btn btn-outline-danger btn-sm" (click)="remove(p.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  products: any[] = [];
  categoriesMap: Record<number, string> = {};
  interactions: any[] = [];
  filterCategoryId: number | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filterCategoryId = params['categoryId'] ? +params['categoryId'] : null;
    });
    this.load();
    this.api.getCategories().subscribe(cats => {
      this.categoriesMap = {};
      cats.forEach((c: any) => (this.categoriesMap[c.id] = c.name));
    });
    this.loadInteractions();
  }

  load() {
    this.api.getProducts().subscribe(data => (this.products = data));
  }

  loadInteractions() {
    this.api.getInteractions().subscribe(data => (this.interactions = data));
  }

  remove(id?: number) {
    if (!id) return;
    if (!confirm('Delete this product?')) return;
    this.api.deleteProduct(id).subscribe(() => this.load());
  }

  getCategoryName(id?: number) {
    if (!id) return '-';
    return this.categoriesMap[id] || '-';
  }

  get isAuth() {
    return this.auth.isAuthenticated();
  }

  get isAdmin() {
    return this.auth.isAdmin();
  }

  get filteredProducts() {
    if (!this.filterCategoryId) {
      return this.products;
    }
    return this.products.filter(p => p.categoryId === this.filterCategoryId);
  }

  clearFilter() {
    this.router.navigate(['/products']);
  }

  getLikes(productId: number) {
    return this.interactions.filter(i => i.productId === productId && i.type === 'like').length;
  }

  getDislikes(productId: number) {
    return this.interactions.filter(i => i.productId === productId && i.type === 'dislike').length;
  }

  getUserInteraction(productId: number) {
    const user = this.auth.getUser();
    if (!user) return null;
    return this.interactions.find(i => i.productId === productId && i.userId === user.id);
  }

  toggleInteraction(productId: number, type: 'like' | 'dislike') {
    const user = this.auth.getUser();
    if (!user) return;

    const existing = this.getUserInteraction(productId);
    if (existing) {
      if (existing.type === type) {
        // Remove interaction (toggle off)
        this.api.deleteInteraction(existing.id).subscribe(() => this.loadInteractions());
      } else {
        // Change interaction type (e.g. like -> dislike)
        // Since json-server doesn't support easy patch/update for this mock, we delete and add
        this.api.deleteInteraction(existing.id).subscribe(() => {
          this.addInteraction(productId, type, user.id);
        });
      }
    } else {
      // Add new interaction
      this.addInteraction(productId, type, user.id);
    }
  }

  private addInteraction(productId: number, type: string, userId: any) {
    this.api.addInteraction({ productId, userId, type }).subscribe(() => this.loadInteractions());
  }
}
