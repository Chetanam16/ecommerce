import { Component, effect, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CartService } from '../../Services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
    constructor(public cartService: CartService,private router:Router) {}
    get cartCount(): number {
      return this.cartService.cartCount();  }
      
  
  navigateToCart(): void {
    this.router.navigate(['/addcart']);
  }
}
