import { Component, Input } from '@angular/core';
import { Sale, SaleItem } from '../../models/sale';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { SalesService } from '../../services/sales.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sale',
  standalone: true,
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    FormsModule,
    MatSnackBarModule,
  ],
  providers: [SalesService, MenuService],
})
export class SaleComponent {
  @Input() saleItems: SaleItem[] = [];
  customerName: string = '';
  customerNameError: string = '';
  displayedColumns: string[] = [
    'dishName',
    'quantity',
    'price',
    'subtotal',
    'actions',
  ];
  totalAmount: number = 0;

  constructor(
    private cartService: CartService,
    private saleService: SalesService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cartService.getTotalAmountObservable().subscribe((total) => {
      this.totalAmount = total;
    });

    this.saleItems = this.cartService.getItems();
  }

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
  }

  onQuantityChange(index: number, event: any): void {
    let newQuantity = Number(event.target.value);
    if (newQuantity < 1) {
      newQuantity = 1;
    }

    this.saleItems[index].quantity = newQuantity;
    this.saleItems[index].subtotal = this.saleItems[index].price * newQuantity;

    this.cartService.updateTotal();
  }

  checkout(): void {
    this.customerNameError = '';
    if (!this.customerName) {
      this.customerNameError = 'Ingrese el nombre del cliente';
      return;
    }

    const sale: Sale = {
      id: 0,
      name: this.customerName,
      totalAmount: this.totalAmount,
      date: new Date(),
    };

    this.saleService.addSale(sale).subscribe((newSale) => {
      const saleItems = this.saleItems.map((item) => ({
        ...item,
        saleId: newSale.id,
      }));

      saleItems.forEach((saleItem) => {
        this.saleService.addSaleItem(saleItem).subscribe();
      });

      this.cartService.clearCart();
      this.router.navigate(['/menu']);
      this.snackBar.open('Pedido guardado correctamente', 'Cerrar', {
        duration: 3000,
      });
    });
  }
}
