import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from './Components/header/header.component';
import { BillingComponent } from './Components/billing/billing.component';
import { AddCartComponent } from './Components/add-cart/add-cart.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { ConfirmationComponent } from './Components/confirmation/confirmation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HomeComponent,HeaderComponent,MatDialogModule,BillingComponent,ConfirmationComponent,AddCartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecommerce';
}
