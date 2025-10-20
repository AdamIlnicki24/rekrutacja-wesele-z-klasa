import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { LOGIN_FAILED_ERROR_MESSAGE } from '../../shared/constants/errorMessages';
import { PASSWORD_MIN_LENGTH } from '../../shared/constants/lengths';
import { NEWS_URL } from '../../shared/constants/urls';
import { ApiErrorShape, ApiMessages } from '../../shared/interfaces/api';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
})
export class Login implements OnInit, OnDestroy {
  form!: FormGroup;
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  private formValueChangesSubscription?: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  private removeServerErrorsFromControls(): void {
    Object.keys(this.form.controls).forEach((controlName) => {
      const control = this.form.get(controlName);

      if (!control) return;

      const currentErrors: ValidationErrors | null = control.errors ?? null;

      if (!currentErrors) return;

      if ('server' in currentErrors) {
        const { server, ...remainingErrors } = currentErrors as Record<string, unknown>;

        const newErrors = Object.keys(remainingErrors).length
          ? (remainingErrors as ValidationErrors)
          : null;

        control.setErrors(newErrors);
      }
    });
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(PASSWORD_MIN_LENGTH),
      ]),
    });

    this.formValueChangesSubscription = this.form.valueChanges.subscribe(() => {
      this.removeServerErrorsFromControls();
      this.errorMessage.set(null);
    });
  }

  ngOnDestroy(): void {
    this.formValueChangesSubscription?.unsubscribe();
  }

  private extractMessageFromApiError(apiError: ApiErrorShape): string | null {
    if (!apiError || typeof apiError !== 'object') return null;

    if (typeof apiError.messages === 'string') return apiError.messages;

    if (apiError.messages && typeof apiError.messages === 'object') {
      const messagesObject = apiError.messages as ApiMessages;

      if (typeof messagesObject['email'] === 'string') return messagesObject['email'];

      const collected: string[] = [];

      Object.values(messagesObject).forEach((value) => {
        if (typeof value === 'string') collected.push(value);

        if (Array.isArray(value)) {
          collected.push(...value.filter((v): v is string => typeof v === 'string'));
        }
      });

      if (collected.length) return collected.join(' ');
    }
    if (typeof apiError.message === 'string') return apiError.message;

    if (typeof apiError.error === 'string') return apiError.error;

    return null;
  }

  submit(): void {
    this.errorMessage.set(null);

    this.removeServerErrorsFromControls();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const credentials = this.form.value as { email: string; password: string };

    this.authService.login(credentials.email, credentials.password).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate([NEWS_URL]);
      },
      error: (errorResponse: unknown) => {
        this.isSubmitting.set(false);
        let displayedErrorMessage = LOGIN_FAILED_ERROR_MESSAGE;

        if (errorResponse instanceof HttpErrorResponse) {
          const apiError = errorResponse.error as ApiErrorShape;
          const extracted = this.extractMessageFromApiError(apiError);
          if (extracted) displayedErrorMessage = extracted;

          if (apiError.messages && typeof apiError.messages === 'object') {
            const messagesObject = apiError.messages as ApiMessages;

            Object.entries(messagesObject).forEach(([fieldName, fieldValue]) => {
              const control = this.form.get(fieldName);

              if (!control) return;

              const serverMessage =
                typeof fieldValue === 'string' ? fieldValue : fieldValue.join(' ');

              const existingErrors: ValidationErrors | null = control.errors
                ? { ...control.errors }
                : null;

              const newErrors: ValidationErrors = existingErrors
                ? { ...existingErrors, server: serverMessage }
                : { server: serverMessage };

              control.setErrors(newErrors);
            });
          }
        }

        this.errorMessage.set(displayedErrorMessage);
      },
    });
  }
}
