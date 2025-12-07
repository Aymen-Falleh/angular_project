import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" style="max-width:760px;margin:1rem auto">
      <a class="btn btn-link mb-2" routerLink="/products">Back</a>
      <div *ngIf="product" class="card">
        <div class="card-body">
          <h2 class="card-title">{{product.name}}</h2>
          <ng-container *ngIf="product.image">
            <img [src]="product.image"
                 class="img-fluid mb-3"
                 style="max-width:100%;max-height:320px;object-fit:cover"
                 (error)="onImageError($event)"
                 alt="Product image" />
          </ng-container>
          <p>{{product.description}}</p>
          <p><strong>Price:</strong> {{product.price | currency}}</p>
          <p><strong>Category:</strong> {{category?.name}}</p>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
    onImageError(event: Event) {
      const img = event.target as HTMLImageElement;
      img.style.display = 'none';
    }
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  product: any = null;
  category: any = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam && !isNaN(Number(idParam)) ? Number(idParam) : null;
    if (id) {
      this.api.getProduct(id).subscribe(
        p => {
          // Ensure id and categoryId are numbers
          const pid = typeof p.id === 'string' ? Number(p.id) : p.id;
          const catId = typeof p.categoryId === 'string' ? Number(p.categoryId) : p.categoryId;
          this.product = { ...p, id: pid, categoryId: catId };
          if (catId) {
            this.api.getCategory(catId).subscribe(c => (this.category = c));
          }
        },
        error => {
          this.product = null;
          this.category = null;
          console.error('Failed to fetch product:', error);
        }
      );
    }
  }
}
