import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'trainer' | 'mentor' | 'admin' | 'student' | 'institution';
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  profileCompletion: number;
  createdAt: string;
  enrollmentCompleted?: boolean;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  education: {
    highestQualification: string;
    fieldOfStudy?: string;
    university?: string;
    graduationYear?: number;
    gpa?: number;
  };
  workExperience: {
    hasExperience: boolean;
    yearsOfExperience: number;
    currentCompany?: string;
    currentPosition?: string;
    previousCompanies?: Array<{
      company: string;
      position: string;
      duration: string;
      description: string;
    }>;
  };
  careerGoals: {
    interestedFields: string[];
    preferredJobRoles: string[];
    salaryExpectation: {
      min: number;
      max: number;
      currency: string;
    };
    preferredWorkMode: 'remote' | 'onsite' | 'hybrid';
    preferredLocation: string[];
  };
  avatar?: string;
  bio?: string;
  skills?: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category: string;
  }>;
  interests?: string[];
  languages?: Array<{
    name: string;
    proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
  }>;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  profileCompletion: number;
  preferences?: any;
  socialLinks?: any;
  enrolledCourses?: any[];
  certificates?: any[];
  createdAt: string;
  enrollmentCompleted?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface StudentSignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  education: {
    highestQualification: string;
    fieldOfStudy?: string;
    university?: string;
    graduationYear?: number;
    gpa?: number;
  };
  workExperience?: {
    hasExperience: boolean;
    yearsOfExperience: number;
    currentCompany?: string;
    currentPosition?: string;
    previousCompanies?: Array<{
      company: string;
      position: string;
      duration: string;
      description: string;
    }>;
  };
  careerGoals?: {
    interestedFields: string[];
    preferredJobRoles: string[];
    salaryExpectation: {
      min: number;
      max: number;
      currency: string;
    };
    preferredWorkMode: 'remote' | 'onsite' | 'hybrid';
    preferredLocation: string[];
  };
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'user' | 'trainer' | 'mentor' | 'admin';
}

export interface OTPRequest {
  email: string;
  otp: string;
}

export interface ResendOTPRequest {
  email: string;
}

export type TrainerSkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface TrainerSkill {
  name: string;
  level: TrainerSkillLevel;
  years?: number;
}

export interface TrainerAchievement {
  title: string;
  organization?: string;
  description?: string;
  year?: string;
  link?: string;
}

export interface Trainer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'trainer';
  avatar?: string;
  bio?: string;
  title?: string;
  location?: string;
  specialization?: string;
  experienceYears?: number;
  website?: string;
  linkedin?: string;
  twitter?: string;
  skills?: TrainerSkill[];
  achievements?: TrainerAchievement[];
  payoutAccount?: PayoutAccount;
  isActive: boolean;
  createdAt: string;
}

export interface PayoutAccount {
  type: 'bank' | 'upi' | 'paypal' | 'stripe';
  holderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  upiId?: string;
  paypalEmail?: string;
  stripeAccountId?: string;
  address?: string;
  country?: string;
  payoutCycle?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  taxId?: string;
  gst?: string;
  notes?: string;
  isVerified?: boolean;
  lastUpdated?: string | Date;
}

export interface TrainerLoginRequest {
  phone: string;
  trainerName: string;
  otp: string;
}

export interface InstitutionLoginRequest {
  phone: string;
  institutionName: string;
  otp: string;
}

export interface StudentLoginRequest {
  phone: string;
  studentName: string;
  otp: string;
}

export interface LoginResponse {
  trainer: Trainer;
  token: string;
}

export interface AuthResponse {
  user?: User;
  student?: Student;
  trainer?: Trainer;
  token: string;
}

export interface RegisterResponse {
  user?: User;
  student?: Student;
  requiresOTP: boolean;
  emailSent: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadCurrentUser();
  }

  // Load user from localStorage on app start
  private loadCurrentUser(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }

  // Sign up new user (TECH WINDOWS signup form)
  signup(data: SignupRequest): Observable<RegisterResponse> {
    return this.apiService.post<RegisterResponse>('/auth/signup', data).pipe(
      map((response: ApiResponse<RegisterResponse>) => {
        return response.data!;
      })
    );
  }

  // Register new user
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.apiService.post<RegisterResponse>('/auth/register', data).pipe(
      map((response: ApiResponse<RegisterResponse>) => {
        return response.data!;
      })
    );
  }

  // Verify OTP
  verifyOTP(data: OTPRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/verify-otp', data).pipe(
      map((response: ApiResponse<AuthResponse>) => {
        if (response.success && response.data && response.data.user) {
          this.setAuthData(response.data.user, response.data.token);
        }
        return response.data!;
      })
    );
  }

  // Resend OTP
  resendOTP(data: ResendOTPRequest): Observable<any> {
    return this.apiService.post<any>('/auth/resend-otp', data).pipe(
      map((response: ApiResponse<any>) => {
        return response.data!;
      })
    );
  }

  // Login user
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login', data).pipe(
      map((response: ApiResponse<AuthResponse>) => {
        if (response.success && response.data && response.data.user) {
          this.setAuthData(response.data.user, response.data.token);
        }
        return response.data!;
      })
    );
  }

  // Login trainer with phone, name, and OTP
  loginTrainer(data: TrainerLoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('/auth/login', data).pipe(
      map((response: ApiResponse<LoginResponse>) => {
        if (response.success && response.data && response.data.trainer) {
          // Convert trainer to User format for compatibility
          const userData: User = {
            id: response.data.trainer.id,
            firstName: response.data.trainer.name.split(' ')[0] || response.data.trainer.name,
            lastName: response.data.trainer.name.split(' ').slice(1).join(' ') || '',
            email: response.data.trainer.email || '',
            role: 'trainer',
            avatar: response.data.trainer.avatar,
            phone: response.data.trainer.phone,
            bio: response.data.trainer.bio,
            isEmailVerified: false,
            isActive: response.data.trainer.isActive,
            profileCompletion: 0,
            createdAt: response.data.trainer.createdAt
          };
          this.setAuthData(userData, response.data.token);
        }
        return response.data!;
      })
    );
  }

  // Login institution with phone, name, and OTP
  loginInstitution(data: InstitutionLoginRequest): Observable<any> {
    return this.apiService.post<any>('/institutions/login', data).pipe(
      map((response: ApiResponse<any>) => {
        if (response.success && response.data && response.data.institution) {
          const inst = response.data.institution;
          const userData: User = {
            id: inst.id,
            firstName: inst.name,
            lastName: '',
            email: inst.email || '',
            role: 'institution',
            avatar: inst.avatar,
            phone: inst.phone,
            bio: inst.bio,
            isEmailVerified: false,
            isActive: inst.isActive,
            profileCompletion: 0,
            createdAt: inst.createdAt
          };
          this.setAuthData(userData, response.data.token);
        }
        return response.data!;
      })
    );
  }

  // Get current trainer profile
  getTrainerProfile(): Observable<Trainer> {
    return this.apiService.getAuth<Trainer>('/auth/me').pipe(
      map((response: ApiResponse<Trainer>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load trainer profile');
        }
        return response.data;
      })
    );
  }

  // Update trainer profile
  updateTrainerProfile(data: Partial<Trainer>): Observable<Trainer> {
    return this.apiService.putAuth<Trainer>('/auth/me', data).pipe(
      map((response: ApiResponse<Trainer>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update trainer profile');
        }
        // Optionally update current user cache if logged in as trainer
        const current = this.getCurrentUserValue();
        if (current && current.role === 'trainer') {
          const updatedUser: User = {
            ...current,
            firstName: response.data.name.split(' ')[0] || response.data.name,
            lastName: response.data.name.split(' ').slice(1).join(' ') || '',
            email: response.data.email || '',
            avatar: response.data.avatar,
            phone: response.data.phone,
            bio: response.data.bio,
            location: response.data.location,
            createdAt: response.data.createdAt
          };
          this.persistCurrentUser(updatedUser);
        }
        return response.data;
      })
    );
  }

  // Get trainer payout account details
  getPayoutAccount(): Observable<PayoutAccount> {
    return this.apiService.getAuth<PayoutAccount>('/auth/payout-account').pipe(
      map((response: ApiResponse<PayoutAccount>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load payout account details');
        }
        return response.data;
      })
    );
  }

  // Update trainer payout account details
  updatePayoutAccount(data: Partial<PayoutAccount>): Observable<PayoutAccount> {
    return this.apiService.putAuth<PayoutAccount>('/auth/payout-account', data).pipe(
      map((response: ApiResponse<PayoutAccount>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update payout account details');
        }
        return response.data;
      })
    );
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  // Get current user
  getCurrentUser(): Observable<User> {
    return this.apiService.getAuth<User>('/auth/me').pipe(
      map((response: ApiResponse<User>) => {
        if (response.success && response.data) {
          this.currentUserSubject.next(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data!;
      })
    );
  }

  // Update user profile
  updateProfile(data: Partial<User>): Observable<User> {
    return this.apiService.putAuth<User>('/auth/update-profile', data).pipe(
      map((response: ApiResponse<User>) => {
        if (response.success && response.data) {
          this.currentUserSubject.next(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data!;
      })
    );
  }

  // Change password
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.apiService.putAuth<any>('/auth/change-password', {
      currentPassword,
      newPassword
    });
  }

  // Forgot password
  forgotPassword(email: string): Observable<any> {
    return this.apiService.post<any>('/auth/forgot-password', { email });
  }

  // Reset password
  resetPassword(resetToken: string, password: string): Observable<AuthResponse> {
    return this.apiService.put<AuthResponse>(`/auth/reset-password/${resetToken}`, { password }).pipe(
      map((response: ApiResponse<AuthResponse>) => {
        if (response.success && response.data && response.data.user) {
          this.setAuthData(response.data.user, response.data.token);
        }
        return response.data!;
      })
    );
  }

  // Logout
  logout(): void {
    this.apiService.postAuth<any>('/auth/logout', {}).subscribe();
    this.clearAuthData();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get current user value
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUserValue();
    return user ? user.role === role : false;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Check if user is trainer
  isTrainer(): boolean {
    return this.hasRole('trainer');
  }

  // Student Authentication Methods
  
  // Register new student
  registerStudent(data: StudentSignupRequest): Observable<RegisterResponse> {
    return this.apiService.post<RegisterResponse>('/students/register', data).pipe(
      map((response: ApiResponse<RegisterResponse>) => {
        return response.data!;
      })
    );
  }

  // Verify OTP for student
  verifyStudentOTP(data: OTPRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/students/verify-otp', data).pipe(
      map((response: ApiResponse<AuthResponse>) => {
        if (response.success && response.data) {
          const userData = response.data.student ? {
            id: response.data.student.id,
            firstName: response.data.student.firstName,
            lastName: response.data.student.lastName,
            email: response.data.student.email,
            role: 'student' as const,
            avatar: response.data.student.avatar,
            phone: response.data.student.phone,
            bio: response.data.student.bio,
            location: response.data.student.address ? 
              `${response.data.student.address.city}, ${response.data.student.address.state}` : undefined,
            isEmailVerified: response.data.student.isEmailVerified,
            isActive: response.data.student.isActive,
            profileCompletion: response.data.student.profileCompletion,
            createdAt: response.data.student.createdAt,
            enrollmentCompleted: response.data.student.enrollmentCompleted
          } : response.data.user!;
          this.setAuthData(userData, response.data.token);
        }
        return response.data!;
      })
    );
  }

  // Resend OTP for student
  resendStudentOTP(data: ResendOTPRequest): Observable<any> {
    return this.apiService.post<any>('/students/resend-otp', data).pipe(
      map((response: ApiResponse<any>) => {
        return response.data!;
      })
    );
  }

  // Login student with phone, name, and OTP
  loginStudent(data: StudentLoginRequest): Observable<any> {
    return this.apiService.post<any>('/students/login', data).pipe(
      map((response: ApiResponse<any>) => {
        if (response.success && response.data && response.data.student) {
          const student = response.data.student;
          const userData: User = {
            id: student.id,
            firstName: student.name,
            lastName: '',
            email: student.email || '',
            role: 'student',
            avatar: student.avatar,
            phone: student.phone,
            bio: student.bio,
            isEmailVerified: false,
            isActive: student.isActive,
            profileCompletion: 0,
            createdAt: student.createdAt,
            enrollmentCompleted: student.enrollmentCompleted
          };
          this.setAuthData(userData, response.data.token);
        }
        return response.data!;
      })
    );
  }

  // Get current student
  getCurrentStudent(): Observable<Student> {
    return this.apiService.getAuth<Student>('/students/me').pipe(
      map((response: ApiResponse<Student>) => {
        if (response.success && response.data) {
          // Update current user with student data
          const userData = {
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            role: 'student' as const,
            avatar: response.data.avatar,
            phone: response.data.phone,
            bio: response.data.bio,
            location: response.data.address ? 
              `${response.data.address.city}, ${response.data.address.state}` : undefined,
            isEmailVerified: response.data.isEmailVerified,
            isActive: response.data.isActive,
            profileCompletion: response.data.profileCompletion,
            createdAt: response.data.createdAt,
            enrollmentCompleted: response.data.enrollmentCompleted
          };
          this.currentUserSubject.next(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
        return response.data!;
      })
    );
  }

  // Update student profile
  updateStudentProfile(data: Partial<Student>): Observable<Student> {
    return this.apiService.putAuth<Student>('/students/update-profile', data).pipe(
      map((response: ApiResponse<Student>) => {
        if (response.success && response.data) {
          // Update current user with student data
          const userData = {
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            role: 'student' as const,
            avatar: response.data.avatar,
            phone: response.data.phone,
            bio: response.data.bio,
            location: response.data.address ? 
              `${response.data.address.city}, ${response.data.address.state}` : undefined,
            isEmailVerified: response.data.isEmailVerified,
            isActive: response.data.isActive,
            profileCompletion: response.data.profileCompletion,
            createdAt: response.data.createdAt,
            enrollmentCompleted: response.data.enrollmentCompleted
          };
          this.currentUserSubject.next(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
        return response.data!;
      })
    );
  }

  // Change student password
  changeStudentPassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.apiService.putAuth<any>('/students/change-password', {
      currentPassword,
      newPassword
    });
  }

  // Forgot password for student
  forgotStudentPassword(email: string): Observable<any> {
    return this.apiService.post<any>('/students/forgot-password', { email });
  }

  // Reset password for student
  resetStudentPassword(resetToken: string, password: string): Observable<AuthResponse> {
    return this.apiService.put<AuthResponse>(`/students/reset-password/${resetToken}`, { password }).pipe(
      map((response: ApiResponse<AuthResponse>) => {
        if (response.success && response.data) {
          const userData = response.data.student ? {
            id: response.data.student.id,
            firstName: response.data.student.firstName,
            lastName: response.data.student.lastName,
            email: response.data.student.email,
            role: 'student' as const,
            avatar: response.data.student.avatar,
            phone: response.data.student.phone,
            bio: response.data.student.bio,
            location: response.data.student.address ? 
              `${response.data.student.address.city}, ${response.data.student.address.state}` : undefined,
            isEmailVerified: response.data.student.isEmailVerified,
            isActive: response.data.student.isActive,
            profileCompletion: response.data.student.profileCompletion,
            createdAt: response.data.student.createdAt
          } : response.data.user!;
          this.setAuthData(userData, response.data.token);
        }
        return response.data!;
      })
    );
  }

  // Check if user is student
  isStudent(): boolean {
    return this.hasRole('student');
  }

  // Institute Registration Methods
  
  // Register new institute
  registerInstitute(data: any): Observable<RegisterResponse> {
    return this.apiService.post<RegisterResponse>('/institutes/register', data).pipe(
      map((response: ApiResponse<RegisterResponse>) => {
        return response.data!;
      })
    );
  }

  // Mentor Registration Methods
  
  // Register new mentor
  registerMentor(data: any): Observable<RegisterResponse> {
    return this.apiService.post<RegisterResponse>('/mentors/register', data).pipe(
      map((response: ApiResponse<RegisterResponse>) => {
        return response.data!;
      })
    );
  }

  // Trainer Registration Methods
  
  // Register new trainer
  registerTrainer(data: any): Observable<RegisterResponse> {
    return this.apiService.post<RegisterResponse>('/trainers/register', data).pipe(
      map((response: ApiResponse<RegisterResponse>) => {
        return response.data!;
      })
    );
  }

  // Persist user session from front-end events (used when backend responses don't include auth data)
  persistCurrentUser(user: User, token?: string): void {
    if (token) {
      localStorage.setItem('token', token);
    }
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Set authentication data
  private setAuthData(user: User, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Clear authentication data
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
