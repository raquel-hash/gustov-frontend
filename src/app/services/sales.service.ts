import { Injectable } from '@angular/core';
import { Sale, SaleItem } from '../models/sale';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private sales: Sale[] = [];
  private baseUrl = 'https://localhost:7115/api/sales';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getSales(): Observable<Sale[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<Sale[]>(this.baseUrl, { headers })
      .pipe(catchError(this.handleError<Sale[]>('getSales', [])));
  }

  addSale(sale: Sale): Observable<Sale> {
    const headers = this.getAuthHeaders();
    return this.http.post<Sale>(`${this.baseUrl}/sale`, sale, { headers }).pipe(
      map((newSale: Sale) => {
        this.sales.push(newSale);
        return newSale;
      }),
      catchError(this.handleError<Sale>('addSale'))
    );
  }

  addSaleItem(saleItem: SaleItem): Observable<SaleItem> {
    const headers = this.getAuthHeaders();
    return this.http
      .post<SaleItem>(`${this.baseUrl}/saleitem`, saleItem, { headers })
      .pipe(catchError(this.handleError<SaleItem>('addSaleItem')));
  }

  getDailySalesReport(date: string): Observable<Sale[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Sale[]>(`${this.baseUrl}/daily-sales-report`, {
      headers,
      params: { date },
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
