import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SaleItem } from '../models/sale';
import { Dish } from '../models/dish';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: SaleItem[] = [];
  private totalAmount: number = 0;
  private itemsSubject: BehaviorSubject<SaleItem[]> = new BehaviorSubject<
    SaleItem[]
  >(this.items);
  private totalAmountSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(this.totalAmount);

  addToCart(dish: Dish): void {
    const existingItem = this.items.find((item) => item.dishName === dish.name);

    if (existingItem) {
      existingItem.quantity++;
      existingItem.subtotal! += dish.price;
    } else {
      this.items.push({
        id: 0,
        saleId: 0,
        dishName: dish.name,
        dishId: dish.id,
        quantity: 1,
        price: dish.price,
        subtotal: dish.price,
      });
    }

    this.updateTotal();
    this.itemsSubject.next([...this.items]);
  }

  getItems(): SaleItem[] {
    return this.items;
  }

  getItemsObservable() {
    return this.itemsSubject.asObservable();
  }

  removeFromCart(index: number): void {
    this.items.splice(index, 1);
    this.updateTotal();
    this.itemsSubject.next(this.items);
  }

  clearCart(): void {
    this.items = [];
    this.updateTotal();
    this.itemsSubject.next(this.items);
  }

  public updateTotal(): void {
    this.totalAmount = this.items.reduce(
      (sum, item) => sum + item.subtotal!,
      0
    );
    this.totalAmountSubject.next(this.totalAmount);
  }

  getTotalAmountObservable() {
    return this.totalAmountSubject.asObservable();
  }
}
