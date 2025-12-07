import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  const apiStub: any = {
    login: (u: string, p: string) => of(u === 'admin' && p === 'password' ? [{ id: 1, username: 'admin' }] : [])
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: 'ApiService', useValue: apiStub }] });
    // Construct with manual injection to avoid Router dependency
    const injector = TestBed;
    service = new AuthService((apiStub as any), ({} as any));
    localStorage.removeItem('mpa_user');
  });

  afterEach(() => localStorage.removeItem('mpa_user'));

  it('should login with correct credentials', async () => {
    const ok = await service.login('admin', 'password');
    expect(ok).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should fail login with wrong credentials', async () => {
    const ok = await service.login('foo', 'bar');
    expect(ok).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
  });
});
