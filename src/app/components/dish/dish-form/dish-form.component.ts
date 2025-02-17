import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Dish } from '../../../models/dish';
import { MenuService } from '../../../services/menu.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dish-form',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './dish-form.component.html',
  styleUrl: './dish-form.component.scss',
  providers: [MenuService],
})
export class DishFormComponent {
  dishForm: FormGroup;
  nameExistsError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DishFormComponent>,
    private menuService: MenuService,
    @Inject(MAT_DIALOG_DATA)
    public data: { dish: Dish | null }
  ) {
    this.dishForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      showInMenu: [true],
    });

    if (data.dish) {
      this.dishForm.setValue({
        name: data.dish.name,
        price: data.dish.price,
        imageUrl: data.dish.imageUrl,
        showInMenu: data.dish.showInMenu,
      });
    }
  }

  onSave(): void {
    if (this.dishForm.valid) {
      const dish: Dish = {
        id: this.data.dish ? this.data.dish.id : 0,
        ...this.dishForm.value,
      };

      if (this.data.dish) {
        this.menuService.updateDish(dish).subscribe({
          next: (response) => {
            console.log('Update response:', response);
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.nameExistsError = error.error.message;
          },
        });
      } else {
        this.menuService.addDish(dish).subscribe({
          next: (response) => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.nameExistsError = error.error.message;
          },
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private handleError(error: any): void {
    console.error('Error response:', error);
    if (error.status === 400 && error.error && error.error.message) {
      this.nameExistsError = error.error.message;
    } else if (error.status === 409 && error.error && error.error.message) {
      this.nameExistsError = error.error.message;
    } else {
      this.nameExistsError = 'An unknown error occurred!';
    }
    console.log(this.nameExistsError);
  }
}
