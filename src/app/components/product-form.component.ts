import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container" style="max-width:760px;margin:1rem auto">
      <div class="card">
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="save()">
            <h2>{{ isEdit ? 'Edit' : 'Add' }} Product</h2>

            <div class="mb-3">
              <label class="form-label">Name</label>
              <input class="form-control" formControlName="name" />
            </div>

            <div class="mb-3">
              <label class="form-label">Description</label>
              <input class="form-control" formControlName="description" />
            </div>

            <div class="row g-3">
              <div class="col-auto mb-3">
                <label class="form-label">Price</label>
                <input class="form-control" type="number" formControlName="price" />
              </div>
              <div class="col-auto mb-3">
                <label class="form-label">Category</label>
                <select class="form-select" formControlName="categoryId">
                  <option *ngFor="let c of categories" [ngValue]="c.id">{{c.name}}</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Image</label>
              <input class="form-control" type="file" (change)="onFile($event)" accept="image/*" />
              <div *ngIf="preview" class="mt-2"><img [src]="preview" class="img-fluid" style="max-width:240px;max-height:160px;object-fit:cover" /></div>
            </div>

            <div class="d-flex justify-content-end gap-2">
              <a class="btn btn-secondary" routerLink="/products">Cancel</a>
              <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    id: [null as number | null],
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    categoryId: [null as number | null, Validators.required],
    image: ['']
  });

  categories: any[] = [];
  preview: string | null = null;
  isEdit = false;

  ngOnInit(): void {
    this.api.getCategories().subscribe(c => (this.categories = c));
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(Number(id))) {
      this.isEdit = true;
      const nid = Number(id);
      this.api.getProduct(nid).subscribe(
        p => {
          // Ensure id and categoryId are numbers
          const pid = typeof p.id === 'string' ? Number(p.id) : p.id;
          const catId = typeof p.categoryId === 'string' ? Number(p.categoryId) : p.categoryId;
          this.form.patchValue({
            id: pid ?? null,
            name: p.name,
            description: p.description,
            price: p.price,
            image: p.image,
            categoryId: catId ?? null
          });
          this.preview = p.image || null;
        },
        error => console.error('Failed to load product:', error)
      );
    }
  }

  onFile(ev: any) {
    const f: File = ev.target.files && ev.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      this.preview = res;
      this.form.patchValue({ image: res });
    };
    reader.readAsDataURL(f);
  }

  save() {
    const v = this.form.value as any;
    // Always ensure id and categoryId are numbers or null
    const id = v.id !== null && v.id !== undefined ? Number(v.id) : null;
    const categoryId = v.categoryId !== null && v.categoryId !== undefined ? Number(v.categoryId) : null;
    const payload = {
      ...v,
      id,
      categoryId
    };
    if (this.isEdit && id) {
      // Update existing product (PUT)
      this.api.updateProduct(id, payload).subscribe(
        () => this.router.navigate(['/products']),
        error => console.error('Failed to update product:', error)
      );
    } else {
      // Create new product (POST)
      const createPayload = { ...payload };
      delete createPayload.id; // Remove id so json-server auto-assigns one
      createPayload.createdAt = new Date().toISOString();
      this.api.createProduct(createPayload).subscribe(
        () => this.router.navigate(['/products']),
        error => console.error('Failed to create product:', error)
      );
    }
  }
}
