import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { PASSWORD_MIN_LENGTH } from '../../../shared/constants/lengths';
import { NEWS_URL } from '../../../shared/constants/urls';
import { LOGIN_FAILED_ERROR_MESSAGE } from '../../../shared/constants/errorMessages';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true,
})
export class Login implements OnInit {
  form!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(PASSWORD_MIN_LENGTH),
      ]),
    });
  }

  submit(): void {
    this.errorMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const { email, password } = this.form.value;

    this.auth.login(email, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate([NEWS_URL]);
      },
      error: (error: Error) => {
        this.isSubmitting = false;
        this.errorMessage = LOGIN_FAILED_ERROR_MESSAGE;
        console.error('Error:', error);
      },
    });
  }
}
