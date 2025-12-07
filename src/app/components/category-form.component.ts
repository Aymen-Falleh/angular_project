import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-category-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container" style="max-width:760px;margin:1rem auto">
      <div class="card">
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="save()">
            <h2>{{ isEdit ? 'Edit' : 'Add' }} Category</h2>

            <div class="mb-3">
              <label class="form-label">Name</label>
              <input class="form-control" formControlName="name" />
            </div>

            <div class="mb-3">
              <label class="form-label">Description</label>
              <input class="form-control" formControlName="description" />
            </div>

            <div class="d-flex justify-content-end gap-2">
              <a class="btn btn-secondary" routerLink="/categories">Cancel</a>
              <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class CategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    id: [null],
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['']
  });

  isEdit = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      const nid = Number(id);
      this.api.getCategory(nid).subscribe(c => this.form.patchValue(c as any));
    }
  }

  save() {
    const v = this.form.value as any;
    const payload = { name: v.name, description: v.description } as any;
    if (this.isEdit && v.id) {
      this.api.updateCategory(v.id, payload).subscribe(() => this.router.navigate(['/categories']));
    } else {
      this.api.createCategory(payload).subscribe(() => this.router.navigate(['/categories']));
    }
  }
}
