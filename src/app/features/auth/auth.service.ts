import { Injectable, signal } from '@angular/core';
import { User } from '../../shared/interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { LOGIN_API_ENDPOINT, LOGOUT_API_ENDPOINT } from '../../shared/constants/apiEndpoints';
import { LOGIN_URL } from '../../shared/constants/urls';
import { LoginRequest, LoginResponse } from '../../shared/interfaces/login';
import { getBrowserName } from '../../shared/utils/getBrowserName';

const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token = signal<string | null>(null);
  user = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken) {
      this.token.set(storedToken);
    }

    if (storedUser) {
      try {
        this.user.set(JSON.parse(storedUser) as User);
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    if (storedToken && !this.user()) {
      this.getUser().subscribe({
        next: () => {},
        error: (err) => {
          console.warn('Nie udało się pobrać profilu w tle', err);
        },
      });
    }
  }

  getUser(): Observable<User> {
    return this.http.get<User>(LOGIN_API_ENDPOINT).pipe(
      tap((currentUser) => {
        this.user.set(currentUser);
        try {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
        } catch (e) {
          console.warn('Nie udało się zapisać usera do localStorage', e);
        }
      })
    );
  }

  private clearAuth(): void {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    this.router.navigate([LOGIN_URL]);
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
        localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
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

  clearAuthSilent(): void {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}