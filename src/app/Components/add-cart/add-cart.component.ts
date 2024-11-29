import { Component } from '@angular/core';
import { Product } from '../../Interfaces/products';
import { CartService } from '../../Services/cart.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-cart',
  standalone: true,
  imports: [CommonModule,MatCardModule,MatCardModule,MatDividerModule,MatButtonModule],
  templateUrl: './add-cart.component.html',
  styleUrl: './add-cart.component.css'
})
export class AddCartComponent {
  selectedProduct: Product | undefined;
  products: Product[] = []; 
  constructor(private productService: ProductService ,public cartService: CartService ,private router:Router) {}
  deleteItem(product:Product): void {
    this.cartService.removeFromCart(product);
    this.products = this.cartService.getCartItems();
  }

  ngOnInit(): void {

    this.products = this.cartService.getCartItems();
  }
  getTotalAmount(): number {
    if (Array.isArray(this.products)) {
      return this.products.reduce((total, product) => {
        if (product.price !== undefined) {
          return total + product.price;
        }
        return total;  
      }, 0);
    }
    return 0;  
  }
  goHome() {
    this.router.navigate(['/']);
  }
  proceedToBilling():void {
    if (this.products.length > 0) {
      this.router.navigate(['/bill'], {
        state: { products: this.products }
      });}
      else{
      console.error('No products in cart');
      
    }
    
    // Navigate to billing page with cart items

  }

}
