import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { CartService } from '../../Services/cart.service';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let cartServiceMock: jasmine.SpyObj<CartService>;
  let routerMock: jasmine.SpyObj<Router>;
  beforeEach(async () => {
    cartServiceMock = jasmine.createSpyObj('CartService', ['cartCount']);
    cartServiceMock.cartCount.and.returnValue(3);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent,MatToolbarModule,RouterTestingModule],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should get correct cart count from CartService', () => {
    expect(component.cartCount).toBe(3); 
    expect(cartServiceMock.cartCount).toHaveBeenCalled(); 
  });
  it('should navigate to addcart route when View Cart is clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/addcart']);
  });
  it('should display correct cart count in button', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('View Cart (3)'); 
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
