import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">Mini Project</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="nav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" routerLink="/products">Products</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/categories">Categories</a></li>
            <li *ngIf="isAdmin" class="nav-item"><a class="nav-link" routerLink="/admin">Dashboard</a></li>
          </ul>
          <div class="d-flex gap-2">
            <ng-container *ngIf="!isAuth">
              <a class="btn btn-outline-primary" routerLink="/login">Login</a>
              <a class="btn btn-primary" routerLink="/register">Register</a>
            </ng-container>
            <button *ngIf="isAuth" class="btn btn-outline-secondary" (click)="logout()">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  private auth = inject(AuthService);

  get isAuth() {
    return this.auth.isAuthenticated();
  }

  get isAdmin() {
    return this.auth.isAdmin();
  }

  logout() {
    this.auth.logout();
  }
}
