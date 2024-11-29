import { Component, signal } from '@angular/core';
import { Product } from '../../Interfaces/products';
import { ProductService } from '../../Services/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { BillingComponent } from '../billing/billing.component';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule,
    MatRadioModule,
    ReactiveFormsModule,
    CommonModule,
    MatPaginatorModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  product = signal<Product[]>([]);
  paginatedProducts = signal<Product[]>([]); 
  pageSize = 8;
  pageIndex = 0; 
  constructor(private productService: ProductService, private router: Router,private cartService:CartService) {}
  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.product.set(data);
      this.updatePaginatedProducts();
    });
  }
  
  
  updatePaginatedProducts(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts.set(this.product().slice(startIndex, endIndex));
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePaginatedProducts();
  }

  onBuy(product: Product): void {
    console.log('Product bought', product),
      this.router.navigate(['/bill'], { state: { product } });
     
  }
  onAddToCart(product: Product): void {
    this.cartService.addToCart(product); 
    console.log('Product added to cart:', product);
  }
  
}
