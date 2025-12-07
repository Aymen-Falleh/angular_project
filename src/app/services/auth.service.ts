import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storageKey = 'mpa_user';

  constructor(private api: ApiService, private router: Router) { }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.storageKey);
  }

  login(username: string, password: string): Promise<boolean> {
    return this.api.login(username, password).toPromise().then(users => {
      if (users && users.length > 0) {
        localStorage.setItem(this.storageKey, JSON.stringify(users[0]));
        return true;
      }
      return false;
    });
  }

  isAdmin(): boolean {
    const u = this.getUser();
    return !!u && (u.role === 'admin' || u.role === 'Admin');
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.router.navigate(['/login']);
  }

  getUser() {
    const v = localStorage.getItem(this.storageKey);
    return v ? JSON.parse(v) : null;
  }

  getUserRole(): string | null {
    const u = this.getUser();
    return u ? u.role || null : null;
  }
  register(user: any): Promise<boolean> {
    return this.api.getUsers().toPromise().then(users => {
      if (users && users.some(u => u.username === user.username)) {
        return false; // Username taken
      }
      const newUser = { ...user, role: 'user' };
      return this.api.createUser(newUser).toPromise().then(createdUser => {
        if (createdUser) {
          localStorage.setItem(this.storageKey, JSON.stringify(createdUser));
          return true;
        }
        return false;
      });
    });
  }
}
