import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Admin Dashboard</h2>
      
      <div class="row mt-4 mb-4">
        <div class="col-md-4">
          <div class="card text-white bg-primary mb-3">
            <div class="card-header">Most Active User</div>
            <div class="card-body">
              <div *ngIf="stats.mostActiveUsers.length > 0; else noActiveUser">
                <div *ngFor="let u of stats.mostActiveUsers">
                  <h5 class="card-title">{{ u.username }}</h5>
                </div>
                <p class="card-text">{{ stats.mostActiveUsers[0].count }} interactions</p>
              </div>
              <ng-template #noActiveUser>
                <h5 class="card-title">N/A</h5>
                <p class="card-text">0 interactions</p>
              </ng-template>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-white bg-success mb-3">
            <div class="card-header">Most Liked Product</div>
            <div class="card-body">
               <div *ngIf="stats.mostLikedProducts.length > 0; else noLikedProduct">
                <div *ngFor="let p of stats.mostLikedProducts">
                  <h5 class="card-title">{{ p.name }}</h5>
                </div>
                <p class="card-text">{{ stats.mostLikedProducts[0].count }} likes</p>
              </div>
              <ng-template #noLikedProduct>
                <h5 class="card-title">N/A</h5>
                <p class="card-text">0 likes</p>
              </ng-template>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-white bg-danger mb-3">
            <div class="card-header">Most Disliked Product</div>
            <div class="card-body">
               <div *ngIf="stats.mostDislikedProducts.length > 0; else noDislikedProduct">
                <div *ngFor="let p of stats.mostDislikedProducts">
                  <h5 class="card-title">{{ p.name }}</h5>
                </div>
                <p class="card-text">{{ stats.mostDislikedProducts[0].count }} dislikes</p>
              </div>
              <ng-template #noDislikedProduct>
                <h5 class="card-title">N/A</h5>
                <p class="card-text">0 dislikes</p>
              </ng-template>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-md-12">
          <div class="card">
              Users Management ({{ users.length }} users found)
            </div>
            <div class="card-body">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let u of users">
                    <td>{{ u.username }}</td>
                    <td>{{ u.fullName || 'N/A' }}</td>
                    <td>{{ u.email || 'N/A' }}</td>
                    <td>{{ u.role }}</td>
                    <td>
                      <button class="btn btn-sm btn-danger" 
                              *ngIf="u.username !== 'admin' && u.id !== currentUserId"
                              (click)="deleteUser(u.id)">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header">
              Recent Interactions
            </div>
            <div class="card-body">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>User</th>
                    <th>Interaction</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let i of enrichedInteractions">
                    <td>{{ i.productName }}</td>
                    <td>{{ i.username }}</td>
                    <td>
                      <span [class.text-success]="i.type === 'like'" [class.text-danger]="i.type === 'dislike'">
                        {{ i.type === 'like' ? '👍 Like' : '👎 Dislike' }}
                      </span>
                    </td>
                    <td>{{ i.id }}</td> 
                  </tr>
                  <tr *ngIf="enrichedInteractions.length === 0">
                    <td colspan="4" class="text-center">No interactions found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);

  interactions: any[] = [];
  products: any[] = [];
  users: any[] = [];
  enrichedInteractions: any[] = [];

  stats = {
    mostActiveUsers: [] as any[],
    mostLikedProducts: [] as any[],
    mostDislikedProducts: [] as any[]
  };

  private auth = inject(AuthService);
  currentUserId: string = '';

  ngOnInit() {
    const user: any = this.auth.getUser();
    this.currentUserId = user ? user.id : '';
    this.loadData();
  }

  loadData() {
    // Load all necessary data
    this.api.getInteractions().subscribe(ints => {
      this.interactions = ints;
      this.checkDataLoaded();
    });
    this.api.getProducts().subscribe(prods => {
      this.products = prods;
      this.checkDataLoaded();
    });
    this.api.getUsers().subscribe(users => {
      this.users = users;
      this.checkDataLoaded();
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.api.deleteUser(id).subscribe(() => {
        this.loadData(); // Refresh data
      });
    }
  }

  checkDataLoaded() {
    if (this.interactions.length && this.products.length && this.users.length) {
      this.enrichData();
      this.calculateStats();
    }
  }

  enrichData() {
    this.enrichedInteractions = this.interactions.map(i => {
      const product = this.products.find(p => p.id == i.productId); // loose equality for string/number ids
      const user = this.users.find(u => u.id == i.userId);
      return {
        ...i,
        productName: product ? product.name : 'Unknown Product',
        username: user ? user.username : 'Unknown User'
      };
    });
  }

  calculateStats() {
    // Helper to find max items
    const findMax = (items: any[], keyFn: (i: any) => string) => {
      const counts: Record<string, number> = {};
      items.forEach(i => {
        const key = keyFn(i);
        counts[key] = (counts[key] || 0) + 1;
      });

      let maxCount = 0;
      for (const count of Object.values(counts)) {
        if (count > maxCount) maxCount = count;
      }

      if (maxCount === 0) return [];

      return Object.entries(counts)
        .filter(([_, count]) => count === maxCount)
        .map(([id, count]) => ({ id, count }));
    };

    // Most Active User
    const activeUsers = findMax(this.interactions, i => i.userId);
    this.stats.mostActiveUsers = activeUsers.map(u => {
      const user = this.users.find(usr => usr.id == u.id);
      return { username: user ? user.username : 'Unknown', count: u.count };
    });

    // Most Liked Product
    const likedProducts = findMax(this.interactions.filter(i => i.type === 'like'), i => i.productId);
    this.stats.mostLikedProducts = likedProducts.map(p => {
      const prod = this.products.find(prd => prd.id == p.id);
      return { name: prod ? prod.name : 'Unknown', count: p.count };
    });

    // Most Disliked Product
    const dislikedProducts = findMax(this.interactions.filter(i => i.type === 'dislike'), i => i.productId);
    this.stats.mostDislikedProducts = dislikedProducts.map(p => {
      const prod = this.products.find(prd => prd.id == p.id);
      return { name: prod ? prod.name : 'Unknown', count: p.count };
    });
  }
}
