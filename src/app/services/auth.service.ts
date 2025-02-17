import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://localhost:7115/api/account';

  constructor(
    private http: HttpClient,
    private authStateService: AuthStateService
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/login`, { username, password })
      .pipe(
        map((response) => {
          if (response && response.token) {
            this.authStateService.setCurrentUser(response);
          }
          return response;
        })
      );
  }

  register(username: string, password: string, role: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, {
      username,
      password,
      role,
    });
  }

  logout(): void {
    this.authStateService.clearCurrentUser();
  }

  getToken(): string | null {
    const currentUser = this.authStateService.currentUserValue;
    return currentUser ? currentUser.token : null;
  }

  setToken(token: string): void {
    const currentUser = this.authStateService.currentUserValue;
    if (currentUser) {
      currentUser.token = token;
      this.authStateService.setCurrentUser(currentUser);
    }
  }

  isAuthenticated(): boolean {
    return !!this.authStateService.currentUserValue;
  }

  getRole(): string | null {
    return this.authStateService.currentUserValue?.role || null;
  }
}
