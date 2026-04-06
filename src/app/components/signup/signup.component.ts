import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, StudentSignupRequest } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  // Form data
  public signupData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    address: '',
    education: '',
    workExperience: '',
    careerGoals: '',
    agreeToTerms: false
  };

  // UI states
  public isLoading: boolean = false;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  // Form submission
  onSignup(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.validateSignupForm()) {
      this.isLoading = true;
      
      const normalizedGender = (this.signupData.gender || '').toLowerCase();
      const gender: 'male' | 'female' | 'other' =
        normalizedGender === 'male' || normalizedGender === 'female' || normalizedGender === 'other'
          ? (normalizedGender as 'male' | 'female' | 'other')
          : 'other';

      const signupRequest: StudentSignupRequest = {
        firstName: this.signupData.firstName,
        lastName: this.signupData.lastName,
        email: this.signupData.email,
        phone: this.signupData.phone,
        password: this.signupData.password,
        dateOfBirth: this.signupData.dateOfBirth,
        gender,
        nationality: this.signupData.nationality,
        address: {
          street: this.signupData.address || '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        },
        education: {
          highestQualification: this.signupData.education || ''
        }
        // workExperience and careerGoals are optional; omit for minimal payload
      };

      this.authService.registerStudent(signupRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message || 'Student account created successfully! Please check your email for OTP verification.';
          
          // Show success message and redirect to OTP verification
          setTimeout(() => {
            this.router.navigate(['/verify-otp'], { 
              queryParams: { 
                email: this.signupData.email,
                type: 'student'
              } 
            });
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Student account creation failed. Please try again.';
          console.error('Student signup error:', error);
        }
      });
    }
  }

  // Form validation
  private validateSignupForm(): boolean {
    if (!this.signupData.firstName || !this.signupData.lastName || !this.signupData.email || 
        !this.signupData.phone || !this.signupData.password || !this.signupData.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }
    if (!this.isValidEmail(this.signupData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }
    if (!this.isValidPhone(this.signupData.phone)) {
      this.errorMessage = 'Please enter a valid phone number';
      return false;
    }
    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }
    if (this.signupData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }
    if (!this.signupData.agreeToTerms) {
      this.errorMessage = 'Please agree to the Terms & Conditions';
      return false;
    }
    return true;
  }

  // Utility methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Password visibility toggle
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Navigate to home
  goToLogin(): void {
    this.router.navigate(['/Home']);
  }
}
