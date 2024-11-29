import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { BillingComponent } from './Components/billing/billing.component';
import { AddCartComponent } from './Components/add-cart/add-cart.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { ConfirmationComponent } from './Components/confirmation/confirmation.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'bill',component:BillingComponent},
    { path: 'confirmation', component: ConfirmationComponent },
    { path: 'addcart', component: AddCartComponent },
    { path: 'payment', component: PaymentComponent },
];
