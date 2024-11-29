import { Injectable } from '@angular/core';
import { Order, Product } from '../Interfaces/products';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products:Product[]=[];
  private apiUrl = 'http://localhost:3000/products';
  // URL to db.json data

  private dataUrls = 'http://localhost:3000/login';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find((product) => product.id === id);
    return of(product); // Returns an observable with the found product
  }

  private dataUrl = 'http://localhost:3000/orders';
  saveOrder(order: any): Observable<any> {
    console.log('Saving order:', order);

    return this.http.post<Order>(this.dataUrl, order);
}
getUserData(): Observable<any> {
  return this.http.get<any>(this.dataUrls);
}
}
