import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, StudentSignupRequest, LoginRequest, RegisterRequest } from '../../services/auth.service';

export type AuthMode = 'signin' | 'signup' | 'student-signup' | 'trainer-signup' | 'mentor-signup' | 'institution-signup';

@Component({
  selector: 'app-auth-popup',
  templateUrl: './auth-popup.component.html',
  styleUrls: ['./auth-popup.component.css']
})
export class AuthPopupComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() mode: AuthMode = 'signin';
  @Output() closePopup = new EventEmitter<void>();
  @Output() authSuccess = new EventEmitter<any>();

  authForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.authForm = this.fb.group({});
  }

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges() {
    this.initializeForm();
  }

  private initializeForm() {
    if (this.mode === 'signin') {
      this.authForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    } else if (this.mode === 'signup') {
      this.authForm = this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      }, { validators: this.passwordMatchValidator });
    } else if (this.mode === 'student-signup') {
      this.authForm = this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        phone: ['', [Validators.required]],
        dateOfBirth: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        nationality: ['', [Validators.required]],
        address: this.fb.group({
          street: ['', [Validators.required]],
          city: ['', [Validators.required]],
          state: ['', [Validators.required]],
          country: ['', [Validators.required]],
          postalCode: ['', [Validators.required]]
        }),
        education: this.fb.group({
          highestQualification: ['', [Validators.required]],
          fieldOfStudy: [''],
          university: [''],
          graduationYear: [''],
          gpa: ['']
        }),
        workExperience: this.fb.group({
          hasExperience: [false],
          yearsOfExperience: [0],
          currentCompany: [''],
          currentPosition: ['']
        }),
        careerGoals: this.fb.group({
          interestedFields: [[]],
          preferredJobRoles: [[]],
          salaryExpectation: this.fb.group({
            min: [''],
            max: [''],
            currency: ['USD']
          }),
          preferredWorkMode: ['hybrid'],
          preferredLocation: [[]]
        })
      });
    } else if (this.mode === 'trainer-signup') {
      this.authForm = this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        specialization: ['', [Validators.required]],
        experience: ['', [Validators.required]],
        bio: ['', [Validators.required]],
        hourlyRate: ['', [Validators.required]]
      }, { validators: this.passwordMatchValidator });
    } else if (this.mode === 'mentor-signup') {
      this.authForm = this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        domain: ['', [Validators.required]],
        experience: ['', [Validators.required]],
        bio: ['', [Validators.required]],
        hourlyRate: ['', [Validators.required]]
      }, { validators: this.passwordMatchValidator });
    } else if (this.mode === 'institution-signup') {
      this.authForm = this.fb.group({
        institutionName: ['', [Validators.required]],
        contactPerson: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        address: ['', [Validators.required]],
        specialization: ['', [Validators.required]],
        description: ['', [Validators.required]]
      }, { validators: this.passwordMatchValidator });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    
    return null;
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      if (this.mode === 'signin') {
        this.handleSignIn();
      } else if (this.mode === 'signup') {
        this.handleSignUp();
      } else if (this.mode === 'student-signup') {
        this.handleStudentSignUp();
      } else if (this.mode === 'trainer-signup') {
        this.handleTrainerSignUp();
      } else if (this.mode === 'mentor-signup') {
        this.handleMentorSignUp();
      } else if (this.mode === 'institution-signup') {
        this.handleInstitutionSignUp();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private handleSignIn() {
    const loginData: LoginRequest = this.authForm.value;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    // Use regular login (email/password) - student login uses phone/OTP and is handled separately
    this.tryLogin(loginData);
  }

  private tryLogin(loginData: LoginRequest) {
    // Use regular login (email/password) - student login uses phone/OTP and is handled separately
    const loginMethod = this.authService.login(loginData);
    
    loginMethod.subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authSuccess.emit({
          mode: 'signin',
          user: response.user,
          token: response.token,
          userType: 'user'
        });
        this.closeModal();
        this.router.navigate(['/Account']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please check your email and password.';
        console.error('Login failed:', error);
      }
    });
  }

  private handleSignUp() {
    const formData = this.authForm.value;
    
    // Create signup request for regular user registration
    const signupRequest: RegisterRequest = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    };

    this.authService.register(signupRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authSuccess.emit({
          mode: 'signup',
          user: response.user,
          requiresOTP: response.requiresOTP,
          emailSent: response.emailSent
        });
        this.closeModal();
        // Navigate to OTP verification or account page
        this.router.navigate(['/Account']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  private handleStudentSignUp() {
    const formData = this.authForm.value;
    const studentData: StudentSignupRequest = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      nationality: formData.nationality,
      address: formData.address,
      education: formData.education,
      workExperience: formData.workExperience,
      careerGoals: formData.careerGoals
    };

    this.authService.registerStudent(studentData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authSuccess.emit({
          mode: 'student-signup',
          student: response.student,
          requiresOTP: response.requiresOTP,
          emailSent: response.emailSent
        });
        this.closeModal();
        // Navigate to OTP verification or account page
        this.router.navigate(['/Account']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  private handleTrainerSignUp() {
    const formData = this.authForm.value;
    
    // Create trainer signup request
    const trainerData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      specialization: formData.specialization,
      experience: formData.experience,
      bio: formData.bio,
      hourlyRate: formData.hourlyRate
    };

    // For now, use regular registration - you can create a specific trainer registration endpoint later
    this.authService.register(trainerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authSuccess.emit({
          mode: 'trainer-signup',
          user: response.user,
          requiresOTP: response.requiresOTP,
          emailSent: response.emailSent
        });
        this.closeModal();
        this.router.navigate(['/Account']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Trainer registration failed. Please try again.';
      }
    });
  }

  private handleMentorSignUp() {
    const formData = this.authForm.value;
    
    // Create mentor signup request
    const mentorData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      domain: formData.domain,
      experience: formData.experience,
      bio: formData.bio,
      hourlyRate: formData.hourlyRate
    };

    // For now, use regular registration - you can create a specific mentor registration endpoint later
    this.authService.register(mentorData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authSuccess.emit({
          mode: 'mentor-signup',
          user: response.user,
          requiresOTP: response.requiresOTP,
          emailSent: response.emailSent
        });
        this.closeModal();
        this.router.navigate(['/Account']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Mentor registration failed. Please try again.';
      }
    });
  }

  private handleInstitutionSignUp() {
    const formData = this.authForm.value;
    
    // Create institution signup request
    const institutionData = {
      firstName: formData.contactPerson,
      lastName: '',
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      institutionName: formData.institutionName,
      address: formData.address,
      specialization: formData.specialization,
      description: formData.description
    };

    // For now, use regular registration - you can create a specific institution registration endpoint later
    this.authService.register(institutionData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authSuccess.emit({
          mode: 'institution-signup',
          user: response.user,
          requiresOTP: response.requiresOTP,
          emailSent: response.emailSent
        });
        this.closeModal();
        this.router.navigate(['/Account']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Institution registration failed. Please try again.';
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.authForm.controls).forEach(key => {
      const control = this.authForm.get(key);
      control?.markAsTouched();
    });
  }

  switchMode() {
    if (this.mode === 'signin') {
      this.mode = 'signup';
    } else if (this.mode === 'signup') {
      this.mode = 'student-signup';
    } else {
      this.mode = 'signin';
    }
    this.errorMessage = '';
    this.initializeForm();
  }

  closeModal() {
    this.closePopup.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.authForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['passwordMismatch']) return 'Passwords do not match';
    }
    return '';
  }

  getTitle(): string {
    switch (this.mode) {
      case 'signin': return 'Sign In';
      case 'signup': return 'Sign Up';
      case 'student-signup': return 'Student Registration';
      case 'trainer-signup': return 'Trainer Registration';
      case 'mentor-signup': return 'Mentor Registration';
      case 'institution-signup': return 'Institution Registration';
      default: return 'Authentication';
    }
  }

  getSubtitle(): string {
    switch (this.mode) {
      case 'signin': return 'Welcome back! Please sign in to your account';
      case 'signup': return 'Create your account to get started';
      case 'student-signup': return 'Join as a student and start your learning journey';
      case 'trainer-signup': return 'Join as a trainer and share your expertise';
      case 'mentor-signup': return 'Join as a mentor and guide others to success';
      case 'institution-signup': return 'Join as an institution and offer quality education';
      default: return '';
    }
  }

  getSwitchText(): string {
    switch (this.mode) {
      case 'signin': return "Don't have an account? Sign up";
      case 'signup': return 'Want to register as a student? Student Signup';
      case 'student-signup': return 'Already have an account? Sign in';
      case 'trainer-signup': return 'Already have an account? Sign in';
      case 'mentor-signup': return 'Already have an account? Sign in';
      case 'institution-signup': return 'Already have an account? Sign in';
      default: return '';
    }
  }

  getButtonText(): string {
    if (this.isLoading) return 'Please wait...';
    
    switch (this.mode) {
      case 'signin': return 'Sign In';
      case 'signup': return 'Sign Up';
      case 'student-signup': return 'Register as Student';
      case 'trainer-signup': return 'Register as Trainer';
      case 'mentor-signup': return 'Register as Mentor';
      case 'institution-signup': return 'Register Institution';
      default: return 'Submit';
    }
  }
}

