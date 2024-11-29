import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../Interfaces/products';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  constructor(private router: Router) {}
  showSuccessMessage: boolean = true;
  ngOnInit(): void {
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.router.navigate(['/']);
    }, 2000);
  }
}
