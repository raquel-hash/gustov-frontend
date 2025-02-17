import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

import { MenuService } from '../../services/menu.service';
import { Dish } from '../../models/dish';
import { CartService } from '../../services/cart.service';
import { SaleComponent } from '../sale/sale.component';
import { SaleItem } from '../../models/sale';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatSidenavModule,
    SaleComponent,
  ],
  providers: [MenuService, CartService],
})
export class MenuComponent implements OnInit {
  dishes: Dish[] = [];
  saleItems: SaleItem[] = [];
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    private menuService: MenuService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.menuService.getMenuDishes().subscribe((dishes) => {
      this.dishes = dishes;
    });

    this.cartService.getItemsObservable().subscribe((items) => {
      this.saleItems = items;
      if (this.saleItems.length < 0) {
        this.sidenav.open();
      } else {
        this.sidenav.close();
      }
    });
  }

  addToCart(dish: Dish): void {
    this.cartService.addToCart(dish);
    if (this.saleItems.length > 0) {
      this.sidenav.open();
    }
  }
}
