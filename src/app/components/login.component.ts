import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="d-flex justify-content-center mt-5">
      <div class="card" style="width:400px">
        <div class="card-body">
          <h2 class="card-title mb-4">Login</h2>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input class="form-control" formControlName="username" placeholder="admin" />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input class="form-control" type="password" formControlName="password" placeholder="password" />
            </div>

            <div class="d-grid gap-2">
              <button class="btn btn-primary" type="submit" [disabled]="form.invalid || loading">
                {{ loading ? 'Logging in...' : 'Login' }}
              </button>
            </div>

            <div *ngIf="errorMsg" class="alert alert-danger mt-3">{{ errorMsg }}</div>
            <div class="text-muted text-center mt-3 small">
              <p>Test credentials:</p>
              <p>Username: <strong>admin</strong></p>
              <p>Password: <strong>password</strong></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  
  loading = false;
  errorMsg = '';

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;
    
    this.loading = true;
    this.errorMsg = '';
    const { username, password } = this.form.value;
    
    this.auth.login(username!, password!).then(ok => {
      this.loading = false;
      if (ok) {
        console.log('Login successful, redirecting to /products');
        this.router.navigate(['/products']);
      } else {
        this.errorMsg = 'Invalid username or password';
        console.error('Login failed: Invalid credentials');
      }
    }).catch(err => {
      this.loading = false;
      this.errorMsg = 'Login error: ' + (err?.message || 'Network error');
      console.error('Login error:', err);
    });
  }
}
