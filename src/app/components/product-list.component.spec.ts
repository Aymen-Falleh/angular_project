import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('ProductListComponent', () => {
  let fixture: ComponentFixture<ProductListComponent>;
  let component: ProductListComponent;

  const apiStub: any = {
    getProducts: () => of([{ id: 1, name: 'A', price: 1, categoryId: 1 }]),
    getCategories: () => of([{ id: 1, name: 'Cat' }]),
    deleteProduct: () => of({})
  };

  const authStub: any = { isAuthenticated: () => false };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ApiService, useValue: apiStub },
        { provide: AuthService, useValue: authStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load products and categories', () => {
    expect(component.products.length).toBeGreaterThan(0);
    expect(component.getCategoryName(1)).toBe('Cat');
  });
});
