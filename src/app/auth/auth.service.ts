import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { LOGIN_API_ENDPOINT, LOGOUT_API_ENDPOINT } from '../shared/constants/apiEndpoints';
import { LOGIN_URL } from '../shared/constants/urls';
import { LoginRequest, LoginResponse } from '../shared/interfaces/login';
import { User } from '../shared/interfaces/user';
import { getBrowserName } from '../shared/utils/getBrowserName';

const TOKEN_STORAGE_KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token = signal<string | null>(null);
  user = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      this.token.set(storedToken);
    }

    effect(() => {
      const current = this.token();
      if (current) {
        localStorage.setItem(TOKEN_STORAGE_KEY, current);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    });
  }

  private clearAuth(): void {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    this.router.navigate([LOGIN_URL]);
  }

  clearAuthSilent(): void {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  getUser(): Observable<User> {
    return this.http.get<User>(LOGIN_API_ENDPOINT).pipe(
      tap((currentUser) => {
        this.user.set(currentUser);
      })
    );
  }

  async initialize(): Promise<void> {
    if (!this.token()) {
      return;
    }

    try {
      await firstValueFrom(this.getUser());
    } catch (err) {
      this.clearAuthSilent();
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
