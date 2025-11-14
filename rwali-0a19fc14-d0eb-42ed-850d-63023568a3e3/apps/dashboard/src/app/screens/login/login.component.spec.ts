import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';


describe('LoginComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [LoginComponent] }));
  it('should create', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
