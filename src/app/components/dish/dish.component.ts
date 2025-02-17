import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Dish } from '../../models/dish';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DishFormComponent } from './dish-form/dish-form.component';

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCheckboxModule,
  ],
  providers: [MenuService],
})
export class DishComponent implements OnInit {
  dishes: Dish[] = [];
  displayedColumns: string[] = [
    'name',
    'price',
    'image',
    'showInMenu',
    'actions',
  ];

  constructor(private menuService: MenuService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getDishes();
  }

  getDishes(): void {
    this.menuService.getAllDishes().subscribe((data) => {
      this.dishes = data;
    });
  }

  openDialog(dish: Dish | null): void {
    const dialogRef = this.dialog.open(DishFormComponent, {
      width: '400px',
      data: { dish },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDishes();
      }
    });
  }

  editDish(dish: Dish): void {
    this.openDialog(dish);
  }

  deleteDish(id: number): void {
    this.menuService.deleteDish(id).subscribe(() => {
      this.getDishes();
    });
  }
}
