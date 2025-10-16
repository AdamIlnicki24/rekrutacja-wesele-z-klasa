import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../features/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
})
export class Header {
  constructor(public auth: AuthService) {}

  onLogout(): void {
    this.auth.logout();
  }
}
