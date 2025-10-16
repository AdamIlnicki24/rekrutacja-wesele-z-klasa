import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LOGIN_URL } from '../../shared/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.auth.token();

    if (!token) {
      this.router.navigate([LOGIN_URL]);
      return false;
    }

    return true;
  }
}