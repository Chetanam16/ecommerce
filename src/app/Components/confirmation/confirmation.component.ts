import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../Interfaces/products';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule,MatCardModule,MatDividerModule,MatGridListModule,MatButtonModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent {
  products: Product[] = []; 
  errorMessage: string='';
  constructor(private router: Router) {
    // this.product =
    //   this.router.getCurrentNavigation()?.extras.state?.['product'];
    // console.log('Product data', this.product);
  }
  getValidPrice(price: any): number {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      console.error(`Invalid price value: ${price}`);  
      return 0;
    }
    return parsedPrice;
  }
  
  ngOnInit(): void {
    console.log('History state:', history.state);
    if (history.state?.products && Array.isArray(history.state.products)) {
      this.products = history.state.products;
      console.log('Products received in Confirmation:', this.products);  // Log for debugging
    } else {
      console.error('No valid products found in confirmation page');
      this.errorMessage = 'No products available for confirmation.';  // Set error message
    }
  }
  getTotalAmount(): number {
    if (Array.isArray(this.products)) {
      return this.products.reduce((sum, product) => sum + this.getValidPrice(product.price), 0);
    }
    return 0;
   }
  onProceedPayment(): void {
    if (this.products.length>0) {
      this.router.navigate(['/payment']);
    }
    else {
      console.error('Cannot proceed to payment: No products in the list.');}

  }
}
