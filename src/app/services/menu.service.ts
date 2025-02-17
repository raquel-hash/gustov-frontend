import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Dish } from '../models/dish';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private baseUrl = 'https://localhost:7115/api/menu';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllDishes(): Observable<Dish[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<Dish[]>(this.baseUrl, { headers })
      .pipe(catchError(this.handleError));
  }

  getMenuDishes(): Observable<Dish[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<Dish[]>(`${this.baseUrl}/visible`, { headers })
      .pipe(catchError(this.handleError));
  }

  addDish(dish: Dish): Observable<Dish> {
    const headers = this.getAuthHeaders();
    return this.http.post<Dish>(`${this.baseUrl}`, dish, { headers });
  }

  updateDish(dish: Dish): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>(`${this.baseUrl}/${dish.id}`, dish, { headers });
  }

  deleteDish(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
