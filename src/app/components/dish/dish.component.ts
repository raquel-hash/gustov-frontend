import { Component, OnInit } from '@angular/core';
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
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Dish } from '../../models/dish';
import { MenuService } from '../../services/menu.service';

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
  ],
  providers: [MenuService],
})
export class DishComponent implements OnInit {
  dishes: Dish[] = [];
  displayedColumns: string[] = ['name', 'price', 'image', 'actions'];
  dishForm: FormGroup;
  isEditMode = false;
  currentDishId: number | null = null;

  constructor(private menuService: MenuService, private fb: FormBuilder) {
    this.dishForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required], // Campo para la URL de la imagen
    });
  }

  ngOnInit(): void {
    this.getDishes();
  }

  getDishes(): void {
    this.menuService.getAllDishes().subscribe((data) => {
      this.dishes = data;
    });
  }

  onSubmit(): void {
    if (this.dishForm.valid) {
      if (this.isEditMode) {
        // Editar plato existente
        const updatedDish: Dish = {
          id: this.currentDishId!,
          ...this.dishForm.value,
        };
        this.menuService.updateDish(updatedDish).subscribe(() => {
          this.getDishes();
          this.resetForm();
        });
      } else {
        // Agregar nuevo plato
        this.menuService.addDish(this.dishForm.value).subscribe(() => {
          this.getDishes();
          this.resetForm();
        });
      }
    }
  }

  editDish(dish: Dish): void {
    this.isEditMode = true;
    this.currentDishId = dish.id;
    this.dishForm.setValue({
      name: dish.name,
      price: dish.price,
      imageUrl: dish.imageUrl,
    });
  }

  deleteDish(id: number): void {
    this.menuService.deleteDish(id).subscribe(() => {
      this.getDishes();
    });
  }

  resetForm(): void {
    this.isEditMode = false;
    this.currentDishId = null;
    this.dishForm.reset();
  }
}
