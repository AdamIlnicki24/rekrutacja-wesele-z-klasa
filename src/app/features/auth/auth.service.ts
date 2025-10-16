import { Injectable, signal } from '@angular/core';
import { User } from '../../shared/interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { LOGIN_API_ENDPOINT, LOGOUT_API_ENDPOINT } from '../../shared/constants/apiEndpoints';
import { LOGIN_URL } from '../../shared/constants/urls';
import { LoginRequest, LoginResponse } from '../../shared/interfaces/login';
import { getBrowserName } from '../../shared/utils/getBrowserName';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token = signal<string | null>(null);
  user = signal<User | null>(null);

  getUser(): Observable<User> {
    return this.http
      .get<User>(LOGIN_API_ENDPOINT)
      .pipe(tap((currentUser) => this.user.set(currentUser)));
  }

  private clearAuth(): void {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem('token');
    this.router.navigate([LOGIN_URL]);
  }

  constructor(private http: HttpClient, private router: Router) {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      this.token.set(storedToken);

      this.getUser().subscribe({
        next: () => {},
        error: () => {
          this.clearAuth();
        },
      });
    }
  }

  login(email: string, password: string): Observable<User> {
    const payload: LoginRequest = {
      email,
      password,
      device: getBrowserName(),
    };

    return this.http.post<LoginResponse>(LOGIN_API_ENDPOINT, payload).pipe(
      tap((response) => {
        this.token.set(response.token);
        localStorage.setItem('token', response.token);
      }),
      switchMap(() => this.getUser())
    );
  }

  logout(): void {
    this.http.get(LOGOUT_API_ENDPOINT).subscribe({
      next: () => {
        this.clearAuth();
      },
      error: () => {
        this.clearAuth();
      },
    });
  }
}
