import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Order, Product } from '../../Interfaces/products';
import { Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatStep, MatStepper, MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatRadioModule,MatStepperModule,ReactiveFormsModule,FormsModule,MatDialogModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css'
})
export class BillingComponent {
  errorMessage: string = '';
  constructor(
private productService:ProductService,  
  private fb: FormBuilder,
    private router: Router
  ) {
    this.products =
    this.router.getCurrentNavigation()?.extras.state?.['product'];
  console.log('Product data', this.products);
  }
  products: Product[] = [];
  addressForm!: FormGroup;
  paymentForm!: FormGroup;
  checkoutForm!: FormGroup;
  getTotalAmount(): number {
    // Ensure products is an array and calculate total amount
    if (Array.isArray(this.products)) {
      return this.products.reduce((total, product) => {
        // Add only products that have a valid price
        if (product.price !== undefined) {
          return total + product.price;
        }
        return total;  // If price is undefined, don't add to total
      }, 0);
    }
    return 0;  // Default return if products is not an array
  }
  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (history.state?.products && Array.isArray(history.state.products)) {
      this.products = history.state.products;
      console.log('Products received in Confirmation:', this.products);  // Log for debugging
    } else {
      console.error('No valid products found in confirmation page');
      this.errorMessage = 'No products available for confirmation.';  // Set error message
    }

    this.addressForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['',
    [
      Validators.required,
      Validators.pattern('^[0-9]{10}$')   
    ]],
    });

    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],  
      cardName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]+')]],  
      expiryDate: ['', Validators.required],  
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],  
    });

    this.checkoutForm = this.fb.group({
      address: this.addressForm,
      payment: this.paymentForm,
    });
  }
  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 10);
  }
  
  onConfirmOrder(): void {
    console.log('Proceed button clicked');
  
    // Check if the product data exists
    if (!this.products || this.products.length === 0) {
      this.errorMessage = 'No product selected. Please go back and select a product.';
      return; // Stop if product is not available
    }
  
    // Check if both address and payment forms are valid
    if (this.paymentForm.invalid || this.addressForm.invalid) {
      this.errorMessage = 'Please fill out all required fields.';
      return; // Stop if form validation fails
    }
  
    // Create order object from form values
    const order: Order = {
      products: this.products,  // Get the selected product from the array
      name: this.addressForm.value.name,
      address: this.addressForm.value.address,
      phone: this.addressForm.value.phone,
      paymentMethod: this.paymentForm.value.paymentMethod,
    };
  
    console.log('Order data:', order);
  
    this.productService.saveOrder(order).subscribe(
      (response) => {
        console.log('Order saved successfully:', response);
        // Navigate to confirmation page
        this.router.navigate(['/confirmation'], {
          state: { products: this.products },
        });
      },
      (error) => {
        this.errorMessage =
          'An error occurred while saving the order. Please try again.';
        console.error('Error saving order: ', error);
      }
    );
  
  }
  
}
