import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'products', pathMatch: 'full' },
	{ path: 'login', loadComponent: () => import('./components/login.component').then(m => m.LoginComponent) },
	{ path: 'register', loadComponent: () => import('./components/register.component').then(m => m.RegisterComponent) },
	{ path: 'products', loadComponent: () => import('./components/product-list.component').then(m => m.ProductListComponent) },
	{ path: 'products/add', loadComponent: () => import('./components/product-form.component').then(m => m.ProductFormComponent), canActivate: [AdminGuard] },
	{ path: 'products/edit/:id', loadComponent: () => import('./components/product-form.component').then(m => m.ProductFormComponent), canActivate: [AdminGuard] },
	{ path: 'products/:id', loadComponent: () => import('./components/product-detail.component').then(m => m.ProductDetailComponent) },
	{ path: 'categories', loadComponent: () => import('./components/category-list.component').then(m => m.CategoryListComponent) },
	{ path: 'categories/add', loadComponent: () => import('./components/category-form.component').then(m => m.CategoryFormComponent), canActivate: [AdminGuard] },
	{ path: 'categories/edit/:id', loadComponent: () => import('./components/category-form.component').then(m => m.CategoryFormComponent), canActivate: [AdminGuard] },
	{ path: 'admin', loadComponent: () => import('./components/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [AdminGuard] }
];
