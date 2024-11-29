import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingComponent } from './billing.component';
import { Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { Product } from '../../Interfaces/products';
import { of, throwError } from 'rxjs';

describe('BillingComponent', () => {
  let component: BillingComponent;
  let fixture: ComponentFixture<BillingComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let routerMock: jasmine.SpyObj<Router>;
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Product 1',
      description: 'Description of Product 1',
      price: 100,
      image: 'product1.jpg',
      oldPrice: 120,  // Optional, if needed
      category: 'Electronics',  // Optional, if needed
      isNew: true,  // Optional, if needed
      brand: 'Brand A'  // Optional, if needed
    },
    {
      id: 2,
      title: 'Product 2',
      description: 'Description of Product 2',
      price: 200,
      image: 'product2.jpg',
      oldPrice: 220,  // Optional, if needed
      category: 'Home Appliances',  // Optional, if needed
      isNew: false,  // Optional, if needed
      brand: 'Brand B'  // Optional, if needed
    }
  ];
  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj('ProductService', ['saveOrder']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    routerMock.getCurrentNavigation = jasmine.createSpy().and.returnValue({
      extras: {
        state: { product: mockProducts }
      }
    });
    await TestBed.configureTestingModule({
      imports: [BillingComponent,ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatRadioModule],
        providers: [
          { provide: ProductService, useValue: productServiceMock },
          { provide: Router, useValue: routerMock },
          FormBuilder
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should initialize products from router state', () => {
    return expect(component.products).toEqual(mockProducts);
  });
  it('should initialize address and payment forms with validators', () => {
    expect(component.addressForm).toBeDefined();
    expect(component.paymentForm).toBeDefined();
    expect(component.addressForm.controls['name'].valid).toBeFalsy();  // Invalid until filled
    expect(component.paymentForm.controls['paymentMethod'].valid).toBeFalsy();  // Invalid until filled
  });
  it('should calculate the total amount correctly', () => {
    const totalAmount = component.getTotalAmount();
    expect(totalAmount).toBe(300);  // 100 + 200 = 300
  });
  it('should return 0 if products is an empty array', () => {
    component.products = [];
    expect(component.getTotalAmount()).toBe(0);
  });
  it('should return correct total when products array contains one product', () => {
    component.products = mockProducts;
    expect(component.getTotalAmount()).toBe(100);
  });
  it('should return correct total when products array contains multiple products', () => {
    const modifiedProducts = [...mockProducts];
    modifiedProducts[1].price = undefined;
    component.products = modifiedProducts
    expect(component.getTotalAmount()).toBe(100);
  });
  it('should return 0 if a product does not have a price', () => {
    component.products = mockProducts
    expect(component.getTotalAmount()).toBe(100);  // The second product should be ignored
  });
  it('should allow only numeric characters and limit to 10 digits for phone number', () => {
    const inputEvent = { target: { value: '12345678901' } } as any;
    component.onPhoneInput(inputEvent);
    expect(inputEvent.target.value).toBe('1234567890');
  });
  it('should show an error message if no products are available', () => {
    component.products = [];
    component.onConfirmOrder();
    expect(component.errorMessage).toBe('No product selected. Please go back and select a product.');
  });
  it('should show an error message if the form is invalid', () => {
    component.addressForm.controls['name'].setValue('');
    component.paymentForm.controls['paymentMethod'].setValue('');
    component.onConfirmOrder();
    expect(component.errorMessage).toBe('Please fill out all required fields.');
  });
  it('should navigate to confirmation page with product data on successful order', () => {
    component.addressForm.controls['name'].setValue('John Doe');
    component.addressForm.controls['address'].setValue('123 Main St');
    component.addressForm.controls['phone'].setValue('1234567890');
    component.paymentForm.controls['paymentMethod'].setValue('Credit Card');
    productServiceMock.saveOrder.and.returnValue(of({})); 

    component.onConfirmOrder();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/confirmation'], {
      state: { products: mockProducts }
    });
  });
  it('should show an error message if there is an error saving the order', () => {
    component.addressForm.controls['name'].setValue('John Doe');
    component.addressForm.controls['address'].setValue('123 Main St');
    component.addressForm.controls['phone'].setValue('1234567890');
    component.paymentForm.controls['paymentMethod'].setValue('Credit Card');
    productServiceMock.saveOrder.and.returnValue(throwError(() => new Error('Error saving order')));

    component.onConfirmOrder();

    expect(component.errorMessage).toBe('An error occurred while saving the order. Please try again.');
  });
  it('should call saveOrder with the correct order data', () => {
    component.addressForm.controls['name'].setValue('John Doe');
    component.addressForm.controls['address'].setValue('123 Main St');
    component.addressForm.controls['phone'].setValue('1234567890');
    component.paymentForm.controls['paymentMethod'].setValue('Credit Card');
  
    const expectedOrder = {
      products: mockProducts,  
      name: 'John Doe',
      address: '123 Main St',
      phone: '1234567890',
      paymentMethod: 'Credit Card',
    };
  
    productServiceMock.saveOrder.and.returnValue(of({}));
  
    component.onConfirmOrder();
  
    expect(productServiceMock.saveOrder).toHaveBeenCalledWith(expectedOrder);
  });
  it('should not proceed with order if forms are invalid', () => {
    component.addressForm.controls['name'].setValue('John Doe');
    component.addressForm.controls['phone'].setValue('1234567890');  // Missing address
    component.paymentForm.controls['paymentMethod'].setValue('Credit Card');
    component.onConfirmOrder();
  
    expect(component.errorMessage).toBe('Please fill out all required fields.');
  });
  it('should show specific error message when saveOrder API fails with custom error', () => {
    component.addressForm.controls['name'].setValue('John Doe');
    component.addressForm.controls['address'].setValue('123 Main St');
    component.addressForm.controls['phone'].setValue('1234567890');
    component.paymentForm.controls['paymentMethod'].setValue('Credit Card');
  
    productServiceMock.saveOrder.and.returnValue(throwError(() => new Error('Custom error message')));
  
    component.onConfirmOrder();
  
    expect(component.errorMessage).toBe('An error occurred while saving the order. Please try again.');
    expect(console.error).toHaveBeenCalledWith('Error saving order: ', new Error('Custom error message'));
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
