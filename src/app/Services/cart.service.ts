import { Injectable, signal } from '@angular/core';
import { Product } from '../Interfaces/products';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<Product[]>([]);
   cartCount = signal(0); 

  addToCart(product: Product): void {
    
    const updatedCart = [...this.cartItems(), product];
    this.cartItems.set(updatedCart);
    this.cartCount.set(updatedCart.length);
  }

  getCartItems(): Product[] {
    return this.cartItems();  
  }
  removeFromCart(product:Product): void {
    const updatedCart = this.cartItems().filter((item) => item.id !== product.id);
    this.cartItems.set(updatedCart);
    this.cartCount.set(updatedCart.length); 
  }
  
  clearCart(): void {
    this.cartItems.set([]);
    this.cartCount.set(0) ;  
  }
  
  constructor() { }
}

