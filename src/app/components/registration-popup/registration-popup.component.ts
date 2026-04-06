import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration-popup',
  templateUrl: './registration-popup.component.html',
  styleUrls: ['./registration-popup.component.css']
})
export class RegistrationPopupComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  
  // Current view state
  public currentView: 'cards' | 'student' | 'institute' | 'mentor' | 'trainer' = 'cards';
  
  // Form data for different registration types
  public studentForm = {
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

  public instituteForm = {
    instituteName: '',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    website: '',
    specialization: '',
    establishedYear: '',
    description: '',
    agreeToTerms: false
  };

  public mentorForm = {
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
    domain: '',
    experience: '',
    qualifications: '',
    hourlyRate: '',
    bio: '',
    agreeToTerms: false
  };

  public trainerForm = {
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
    specialization: '',
    experience: '',
    qualifications: '',
    hourlyRate: '',
    bio: '',
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

  // Navigation methods
  showCards(): void {
    this.currentView = 'cards';
    this.clearMessages();
  }

  showStudentForm(): void {
    this.currentView = 'student';
    this.clearMessages();
  }

  showInstituteForm(): void {
    this.currentView = 'institute';
    this.clearMessages();
  }

  showMentorForm(): void {
    this.currentView = 'mentor';
    this.clearMessages();
  }

  showTrainerForm(): void {
    this.currentView = 'trainer';
    this.clearMessages();
  }

  // Form submission methods
  onStudentSignup(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.validateStudentForm()) {
      this.isLoading = true;
      
      const normalizedGender = (this.studentForm.gender || '').toLowerCase();
      const gender: 'male' | 'female' | 'other' =
        normalizedGender === 'male' || normalizedGender === 'female' || normalizedGender === 'other'
          ? (normalizedGender as 'male' | 'female' | 'other')
          : 'other';

      const signupRequest = {
        firstName: this.studentForm.firstName,
        lastName: this.studentForm.lastName,
        email: this.studentForm.email,
        phone: this.studentForm.phone,
        password: this.studentForm.password,
        dateOfBirth: this.studentForm.dateOfBirth,
        gender,
        nationality: this.studentForm.nationality,
        address: {
          street: this.studentForm.address || '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        },
        education: {
          highestQualification: this.studentForm.education || ''
        }
      };

      this.authService.registerStudent(signupRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message || 'Student account created successfully! Please check your email for OTP verification.';
          
          setTimeout(() => {
            this.router.navigate(['/verify-otp'], { 
              queryParams: { 
                email: this.studentForm.email,
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

  onInstituteSignup(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.validateInstituteForm()) {
      this.isLoading = true;
      
      const signupRequest = {
        instituteName: this.instituteForm.instituteName,
        contactPerson: this.instituteForm.contactPerson,
        email: this.instituteForm.email,
        phone: this.instituteForm.phone,
        password: this.instituteForm.password,
        address: {
          street: this.instituteForm.address || '',
          city: this.instituteForm.city || '',
          state: this.instituteForm.state || '',
          country: this.instituteForm.country || '',
          postalCode: this.instituteForm.postalCode || ''
        },
        website: this.instituteForm.website,
        specialization: this.instituteForm.specialization,
        establishedYear: this.instituteForm.establishedYear,
        description: this.instituteForm.description
      };

      this.authService.registerInstitute(signupRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message || 'Institute account created successfully! Please check your email for OTP verification.';
          
          setTimeout(() => {
            this.router.navigate(['/verify-otp'], { 
              queryParams: { 
                email: this.instituteForm.email,
                type: 'institute'
              } 
            });
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Institute account creation failed. Please try again.';
          console.error('Institute signup error:', error);
        }
      });
    }
  }

  onMentorSignup(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.validateMentorForm()) {
      this.isLoading = true;
      
      const normalizedGender = (this.mentorForm.gender || '').toLowerCase();
      const gender: 'male' | 'female' | 'other' =
        normalizedGender === 'male' || normalizedGender === 'female' || normalizedGender === 'other'
          ? (normalizedGender as 'male' | 'female' | 'other')
          : 'other';

      const signupRequest = {
        firstName: this.mentorForm.firstName,
        lastName: this.mentorForm.lastName,
        email: this.mentorForm.email,
        phone: this.mentorForm.phone,
        password: this.mentorForm.password,
        dateOfBirth: this.mentorForm.dateOfBirth,
        gender,
        nationality: this.mentorForm.nationality,
        address: {
          street: this.mentorForm.address || '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        },
        domain: this.mentorForm.domain,
        experience: this.mentorForm.experience,
        qualifications: this.mentorForm.qualifications,
        hourlyRate: parseFloat(this.mentorForm.hourlyRate) || 0,
        bio: this.mentorForm.bio
      };

      this.authService.registerMentor(signupRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message || 'Mentor account created successfully! Please check your email for OTP verification.';
          
          setTimeout(() => {
            this.router.navigate(['/verify-otp'], { 
              queryParams: { 
                email: this.mentorForm.email,
                type: 'mentor'
              } 
            });
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Mentor account creation failed. Please try again.';
          console.error('Mentor signup error:', error);
        }
      });
    }
  }

  onTrainerSignup(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.validateTrainerForm()) {
      this.isLoading = true;
      
      const normalizedGender = (this.trainerForm.gender || '').toLowerCase();
      const gender: 'male' | 'female' | 'other' =
        normalizedGender === 'male' || normalizedGender === 'female' || normalizedGender === 'other'
          ? (normalizedGender as 'male' | 'female' | 'other')
          : 'other';

      const signupRequest = {
        firstName: this.trainerForm.firstName,
        lastName: this.trainerForm.lastName,
        email: this.trainerForm.email,
        phone: this.trainerForm.phone,
        password: this.trainerForm.password,
        dateOfBirth: this.trainerForm.dateOfBirth,
        gender,
        nationality: this.trainerForm.nationality,
        address: {
          street: this.trainerForm.address || '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        },
        specialization: this.trainerForm.specialization,
        experience: this.trainerForm.experience,
        qualifications: this.trainerForm.qualifications,
        hourlyRate: parseFloat(this.trainerForm.hourlyRate) || 0,
        bio: this.trainerForm.bio
      };

      this.authService.registerTrainer(signupRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message || 'Trainer account created successfully! Please check your email for OTP verification.';
          
          setTimeout(() => {
            this.router.navigate(['/verify-otp'], { 
              queryParams: { 
                email: this.trainerForm.email,
                type: 'trainer'
              } 
            });
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Trainer account creation failed. Please try again.';
          console.error('Trainer signup error:', error);
        }
      });
    }
  }

  // Form validation methods
  private validateStudentForm(): boolean {
    if (!this.studentForm.firstName || !this.studentForm.lastName || !this.studentForm.email || 
        !this.studentForm.phone || !this.studentForm.password || !this.studentForm.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }
    if (!this.isValidEmail(this.studentForm.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }
    if (!this.isValidPhone(this.studentForm.phone)) {
      this.errorMessage = 'Please enter a valid phone number';
      return false;
    }
    if (this.studentForm.password !== this.studentForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }
    if (this.studentForm.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }
    if (!this.studentForm.agreeToTerms) {
      this.errorMessage = 'Please agree to the Terms & Conditions';
      return false;
    }
    return true;
  }

  private validateInstituteForm(): boolean {
    if (!this.instituteForm.instituteName || !this.instituteForm.contactPerson || !this.instituteForm.email || 
        !this.instituteForm.phone || !this.instituteForm.password || !this.instituteForm.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }
    if (!this.isValidEmail(this.instituteForm.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }
    if (!this.isValidPhone(this.instituteForm.phone)) {
      this.errorMessage = 'Please enter a valid phone number';
      return false;
    }
    if (this.instituteForm.password !== this.instituteForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }
    if (this.instituteForm.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }
    if (!this.instituteForm.agreeToTerms) {
      this.errorMessage = 'Please agree to the Terms & Conditions';
      return false;
    }
    return true;
  }

  private validateMentorForm(): boolean {
    if (!this.mentorForm.firstName || !this.mentorForm.lastName || !this.mentorForm.email || 
        !this.mentorForm.phone || !this.mentorForm.password || !this.mentorForm.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }
    if (!this.isValidEmail(this.mentorForm.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }
    if (!this.isValidPhone(this.mentorForm.phone)) {
      this.errorMessage = 'Please enter a valid phone number';
      return false;
    }
    if (this.mentorForm.password !== this.mentorForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }
    if (this.mentorForm.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }
    if (!this.mentorForm.agreeToTerms) {
      this.errorMessage = 'Please agree to the Terms & Conditions';
      return false;
    }
    return true;
  }

  private validateTrainerForm(): boolean {
    if (!this.trainerForm.firstName || !this.trainerForm.lastName || !this.trainerForm.email || 
        !this.trainerForm.phone || !this.trainerForm.password || !this.trainerForm.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }
    if (!this.isValidEmail(this.trainerForm.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }
    if (!this.isValidPhone(this.trainerForm.phone)) {
      this.errorMessage = 'Please enter a valid phone number';
      return false;
    }
    if (this.trainerForm.password !== this.trainerForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }
    if (this.trainerForm.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }
    if (!this.trainerForm.agreeToTerms) {
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

  // Clear messages
  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Close popup
  closePopup(): void {
    this.close.emit();
  }
}
