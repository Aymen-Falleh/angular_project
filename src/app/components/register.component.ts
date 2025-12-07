import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="d-flex justify-content-center mt-5">
      <div class="card" style="width:400px">
        <div class="card-body">
          <h2 class="card-title mb-4">Register</h2>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="mb-3">
              <label class="form-label">Full Name</label>
              <input class="form-control" formControlName="fullName" placeholder="John Doe" />
            </div>

            <div class="mb-3">
              <label class="form-label">Email</label>
              <input class="form-control" type="email" formControlName="email" placeholder="john@example.com" />
            </div>

            <div class="mb-3">
              <label class="form-label">Phone</label>
              <input class="form-control" formControlName="phone" placeholder="+1234567890" />
            </div>

            <div class="mb-3">
              <label class="form-label">Address</label>
              <textarea class="form-control" formControlName="address" placeholder="123 Main St"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Username</label>
              <input class="form-control" formControlName="username" placeholder="Choose a username" />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input class="form-control" type="password" formControlName="password" placeholder="Choose a password" />
            </div>

            <div class="d-grid gap-2">
              <button class="btn btn-success" type="submit" [disabled]="form.invalid || loading">
                {{ loading ? 'Registering...' : 'Register' }}
              </button>
            </div>

            <div *ngIf="errorMsg" class="alert alert-danger mt-3">{{ errorMsg }}</div>
            
            <div class="text-center mt-3">
              <a routerLink="/login" class="text-decoration-none">Already have an account? Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMsg = '';

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMsg = '';
    const val = this.form.value;

    this.auth.register(val).then(ok => {
      this.loading = false;
      if (ok) {
        console.log('Registration successful, redirecting to /products');
        this.router.navigate(['/products']);
      } else {
        this.errorMsg = 'Registration failed. Username might be taken.';
      }
    }).catch(err => {
      this.loading = false;
      this.errorMsg = 'Registration error: ' + (err?.message || 'Network error');
    });
  }
}
