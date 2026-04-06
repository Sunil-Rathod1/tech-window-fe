import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  AuthService,
  InstitutionLoginRequest,
  LoginResponse,
  StudentLoginRequest,
  TrainerLoginRequest
} from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';

export type LoginRole = 'admin' | 'trainer' | 'institution' | 'student';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  role: LoginRole = 'trainer';

  adminForm: FormGroup;
  otpForm: FormGroup;

  isLoading = false;
  errorMessage = '';
  otpDigits: string[] = ['', '', '', '', '', ''];
  readonly defaultOTP = '123456';
  showAdminPassword = false;

  private querySub?: Subscription;

  readonly roles: { id: LoginRole; label: string; short: string; icon: string }[] = [
    { id: 'admin', label: 'Admin', short: 'Admin', icon: 'fas fa-shield-alt' },
    { id: 'trainer', label: 'Trainer', short: 'Trainer', icon: 'fas fa-chalkboard-teacher' },
    { id: 'institution', label: 'Institution', short: 'Institute', icon: 'fas fa-building' },
    { id: 'student', label: 'Student', short: 'Student', icon: 'fas fa-user-graduate' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.adminForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.otpForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[1-9][\d]{0,15}$/)]],
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit(): void {
    this.querySub = this.route.queryParamMap.subscribe((params) => {
      const r = params.get('role') as LoginRole | null;
      if (r && this.isValidRole(r)) {
        this.setRole(r, false);
      }
    });

    if (this.role === 'admin' && this.adminService.isAuthenticated()) {
      this.router.navigate(['/admin-dashboard']);
      return;
    }

    this.resetOtpUi();
  }

  ngOnDestroy(): void {
    this.querySub?.unsubscribe();
  }

  private isValidRole(r: string): r is LoginRole {
    return r === 'admin' || r === 'trainer' || r === 'institution' || r === 'student';
  }

  setRole(role: LoginRole, updateUrl = true): void {
    this.role = role;
    this.errorMessage = '';
    if (role !== 'admin') {
      this.resetOtpUi();
    } else {
      this.adminForm.markAsUntouched();
    }
    if (updateUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { role },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
  }

  get isOtpRole(): boolean {
    return this.role === 'trainer' || this.role === 'institution' || this.role === 'student';
  }

  get activeRoleMeta(): { id: LoginRole; label: string; short: string; icon: string } | undefined {
    return this.roles.find((r) => r.id === this.role);
  }

  get roleSubtitle(): string {
    switch (this.role) {
      case 'admin':
        return 'Admin portal';
      case 'trainer':
        return 'Trainer sign in';
      case 'institution':
        return 'Institution sign in';
      case 'student':
        return 'Student sign in';
      default:
        return 'Sign in';
    }
  }

  get phonePlaceholder(): string {
    switch (this.role) {
      case 'student':
        return 'Registered mobile number';
      case 'institution':
        return 'Institution contact number';
      case 'trainer':
        return 'Registered mobile number';
      default:
        return 'Phone number';
    }
  }

  get namePlaceholder(): string {
    switch (this.role) {
      case 'student':
        return 'Full name as on enrollment';
      case 'institution':
        return 'Institution or organization name';
      case 'trainer':
        return 'Name as on your trainer profile';
      default:
        return 'Name';
    }
  }

  onSubmitAdmin(): void {
    this.errorMessage = '';
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }
    const { username, password } = this.adminForm.value;
    this.isLoading = true;
    this.adminService.login(username, password).subscribe({
      next: () => {
        this.isLoading = false;
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const safe =
          returnUrl &&
          returnUrl.startsWith('/') &&
          !returnUrl.startsWith('//') &&
          !returnUrl.includes(':');
        this.router.navigateByUrl(safe ? returnUrl : '/admin-dashboard');
      },
      error: (error: any) => {
        this.isLoading = false;
        if (error.status === 0 || !error.status) {
          this.errorMessage =
            'Unable to connect to server. Please check if the backend is running.';
        } else if (error.status === 401) {
          this.errorMessage = error.error?.message || 'Invalid username or password.';
        } else if (error.status === 404) {
          this.errorMessage = 'Admin login endpoint not found. Check backend configuration.';
        } else if (error.status === 500) {
          this.errorMessage = error.error?.message || 'Server error. Try again later.';
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'Login failed. Check your credentials and try again.';
        }
      }
    });
  }

  onSubmitOtp(): void {
    this.errorMessage = '';
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
    const { phone, displayName, otp } = this.otpForm.value;
    this.isLoading = true;

    if (this.role === 'trainer') {
      const req: TrainerLoginRequest = {
        phone,
        trainerName: displayName,
        otp
      };
      this.authService.loginTrainer(req).subscribe({
        next: (_response: LoginResponse) => {
          this.isLoading = false;
          this.router.navigate(['/trainer-dashboard']);
        },
        error: (error) => this.handleOtpError(error)
      });
      return;
    }

    if (this.role === 'institution') {
      const req: InstitutionLoginRequest = {
        phone,
        institutionName: displayName,
        otp
      };
      this.authService.loginInstitution(req).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/institution-dashboard']);
        },
        error: (error) => this.handleOtpError(error)
      });
      return;
    }

    if (this.role === 'student') {
      const req: StudentLoginRequest = {
        phone,
        studentName: displayName,
        otp
      };
      this.authService.loginStudent(req).subscribe({
        next: (response) => {
          this.isLoading = false;
          const done = !!response?.student?.enrollmentCompleted;
          this.router.navigate([done ? '/Account' : '/student-enrollment']);
        },
        error: (error) => this.handleOtpError(error)
      });
    }
  }

  private handleOtpError(error: any): void {
    this.isLoading = false;
    this.errorMessage =
      error.error?.message || error.message || 'Login failed. Check your details and OTP.';
  }

  private resetOtpUi(): void {
    this.otpForm.patchValue({ otp: this.defaultOTP });
    this.otpDigits = this.defaultOTP.split('');
  }

  get otpFormControls() {
    return this.otpForm.controls;
  }

  hasOtpError(fieldName: string): boolean {
    const field = this.otpForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getOtpErrorMessage(fieldName: string): string {
    const field = this.otpForm.get(fieldName);
    const label =
      fieldName === 'displayName'
        ? this.nameFieldLabel
        : fieldName === 'phone'
          ? 'Phone'
          : fieldName === 'otp'
            ? 'OTP'
            : fieldName;
    if (field?.hasError('required')) {
      return `${label} is required`;
    }
    if (field?.hasError('pattern')) {
      if (fieldName === 'phone') {
        return 'Please enter a valid phone number';
      }
      if (fieldName === 'otp') {
        return 'OTP must be 6 digits';
      }
    }
    if (field?.hasError('minlength')) {
      return `${label} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }

  get nameFieldLabel(): string {
    switch (this.role) {
      case 'student':
        return 'Student name';
      case 'institution':
        return 'Institution name';
      case 'trainer':
        return 'Trainer name';
      default:
        return 'Name';
    }
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 1) {
      value = value.charAt(0);
    }

    this.otpDigits[index] = value;
    input.value = value;

    const otpValue = this.otpDigits.join('');
    this.otpForm.patchValue({ otp: otpValue });

    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp${index + 1}"]`) as HTMLInputElement;
      nextInput?.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    const target = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !target.value && index > 0) {
      const prevInput = document.querySelector(`input[name="otp${index - 1}"]`) as HTMLInputElement;
      prevInput?.focus();
    }
  }

  fillDefaultOTP(): void {
    this.otpDigits = this.defaultOTP.split('');
    this.otpForm.patchValue({ otp: this.defaultOTP });
  }

  toggleAdminPassword(): void {
    this.showAdminPassword = !this.showAdminPassword;
  }
}
