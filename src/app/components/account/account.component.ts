import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WishlistService, WishlistItem } from 'src/app/services/wishlist.service';
import { AccountService, AccountOverview, UserProfile, AccountStats, Order, LearningProgress, PaymentDetails } from 'src/app/services/account.service';
import { LocalCartService, LocalCartItem } from 'src/app/services/local-cart.service';
import { TrainersService } from 'src/app/services/trainers.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { StudentService, StudentProfile, AccountSettings } from 'src/app/services/student.service';
import { SupportTicketService, SupportTicket, CreateTicketRequest } from 'src/app/services/support-ticket.service';
import { Subscription } from 'rxjs';

interface TrainerRating {
  teaching: number;
  communication: number;
  punctuality: number;
  submitted: boolean;
}

interface InstituteRating {
  teaching: number;
  facilities: number;
  placement: number;
  submitted: boolean;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {

  // API Data Properties
  accountOverview: AccountOverview | null = null;
  userProfile: UserProfile | null = null;
  accountStats: AccountStats | null = null;
  orders: Order[] = [];
  courseDetails: LearningProgress[] = [];
  
  // Loading and Error States
  loading: boolean = true;
  error: string = '';

  // Current Active Section
  activeSection = 'overview';

  // Expanded course tracking
  expandedCourseId: string | null = null;

  // Rating state for courses
  courseRatings: { [courseId: string]: { trainer?: TrainerRating; institute?: InstituteRating } } = {};

  // Payment Details Modal
  showPaymentModal: boolean = false;
  paymentDetails: PaymentDetails | null = null;
  isLoadingPaymentDetails: boolean = false;
  paymentDetailsError: string = '';

  // Certificate Download State
  downloadingCertificateId: string | null = null;
  downloadingIdCardId: string | null = null;

  // Orders Data
  ordersData = [
    {
      id: 'ORD-001',
      courseName: 'Advanced React Development',
      amount: 4999,
      status: 'Completed',
      date: '2024-11-15',
      paymentMethod: 'Credit Card',
      invoice: 'INV-001'
    },
    {
      id: 'ORD-002',
      courseName: 'Machine Learning Basics',
      amount: 6999,
      status: 'In Progress',
      date: '2024-11-20',
      paymentMethod: 'UPI',
      invoice: 'INV-002'
    },
    {
      id: 'ORD-003',
      courseName: 'Mobile App Development',
      amount: 5499,
      status: 'Completed',
      date: '2024-11-25',
      paymentMethod: 'Net Banking',
      invoice: 'INV-003'
    }
  ];

  // Loading state for orders
  isLoadingOrders: boolean = false;

  // Personal Information
  personalInfo = {
    profilePicture: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    nationality: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: ''
    },
    education: '',
    occupation: '',
    company: '',
    experience: '',
    skills: [] as string[],
    linkedin: '',
    github: '',
    portfolio: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    bio: ''
  };

  // Edit mode state
  isEditingPersonalInfo: boolean = false;
  personalInfoForm: any = {};
  profilePictureFile: File | null = null;
  profilePicturePreview: string = '';
  isLoadingPersonalInfo = false;
  personalInfoError = '';
  isSavingPersonalInfo = false;

  // Account Settings
  accountSettings: AccountSettings = {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    twoFactorAuth: false,
    privacyLevel: 'Standard',
    language: 'English',
    timezone: 'IST (UTC+5:30)',
    currency: 'INR'
  };
  isLoadingAccountSettings = false;
  accountSettingsError = '';
  isSavingAccountSettings = false;

  // Help and Support
  supportTickets: SupportTicket[] = [];
  isLoadingTickets: boolean = false;
  ticketsError: string = '';
  
  // New ticket modal
  showNewTicketModal: boolean = false;
  newTicketForm: CreateTicketRequest = {
    subject: '',
    category: 'Other',
    priority: 'Medium',
    description: '',
    tags: []
  };
  isCreatingTicket: boolean = false;
  
  // Ticket details modal
  showTicketDetailsModal: boolean = false;
  selectedTicket: SupportTicket | null = null;
  isLoadingTicketDetails: boolean = false;
  ticketDetailsError: string = '';
  
  // Reply message
  replyMessage: string = '';
  isSendingReply: boolean = false;

  // Additional data properties for new sections
  socialLinks = {
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    twitter: 'https://twitter.com/johndoe',
    portfolio: 'https://johndoe.dev'
  };

  emergencyContacts = [
    {
      id: 1,
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '+91 98765 43210',
      email: 'jane.smith@email.com',
      address: '123 Main St, Mumbai, Maharashtra 400001'
    },
    {
      id: 2,
      name: 'Robert Johnson',
      relationship: 'Brother',
      phone: '+91 98765 43211',
      email: 'robert.johnson@email.com',
      address: '456 Oak Ave, Delhi, Delhi 110001'
    }
  ];

  learningPreferences = {
    method: 'visual',
    difficulty: 'intermediate',
    pace: 'moderate',
    topics: ['Web Development', 'Machine Learning', 'Mobile Development'],
    timeCommitment: '2-3 hours per week',
    preferredFormat: 'Video + Hands-on',
    language: 'English',
    accessibility: {
      subtitles: true,
      transcripts: true,
      audioDescription: false,
      highContrast: false
    }
  };

  certificates = [
    {
      id: 'CERT-001',
      courseName: 'Advanced React Development',
      issuedDate: '2024-11-15',
      expiryDate: '2025-11-15',
      credentialId: 'AR-2024-001',
      verificationUrl: 'https://verify.techwindows.com/AR-2024-001',
      downloadUrl: 'https://certificates.techwindows.com/AR-2024-001.pdf',
      issuer: 'TechWindows Academy',
      grade: 'A+',
      skills: ['React', 'JavaScript', 'Frontend Development']
    },
    {
      id: 'CERT-002',
      courseName: 'Machine Learning Basics',
      issuedDate: '2024-11-20',
      expiryDate: '2025-11-20',
      credentialId: 'ML-2024-002',
      verificationUrl: 'https://verify.techwindows.com/ML-2024-002',
      downloadUrl: 'https://certificates.techwindows.com/ML-2024-002.pdf',
      issuer: 'TechWindows Academy',
      grade: 'A',
      skills: ['Python', 'Machine Learning', 'Data Science']
    }
  ];

  privacySettings = {
    profileVisibility: 'Public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessages: true,
    dataSharing: 'Limited',
    analytics: true
  };

  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private wishlistService: WishlistService,
    private accountService: AccountService,
    private localCartService: LocalCartService,
    private trainersService: TrainersService,
    private apiService: ApiService,
    private authService: AuthService,
    private studentService: StudentService,
    private supportTicketService: SupportTicketService
  ) {}

  ngOnInit(): void {
    this.loadAccountData();
    this.loadPersonalInfo();
    this.loadAccountSettings();
    // Load cart items for wishlist section
    this.subscriptions.push(
      this.localCartService.items$.subscribe((items) => {
        this.wishlistItems = items;
      })
    );
  }

  // Load personal information based on user type
  loadPersonalInfo(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    this.isLoadingPersonalInfo = true;
    this.personalInfoError = '';

    const user = this.authService.getCurrentUserValue();
    if (!user) {
      this.isLoadingPersonalInfo = false;
      return;
    }

    if (user.role === 'student') {
      this.loadStudentPersonalInfo();
    } else if (user.role === 'trainer') {
      this.loadTrainerPersonalInfo();
    } else if (user.role === 'institution') {
      this.loadInstitutionPersonalInfo();
    } else {
      this.isLoadingPersonalInfo = false;
    }
  }

  private loadStudentPersonalInfo(): void {
    this.studentService.getStudentProfile().subscribe({
      next: (profile: StudentProfile) => {
        this.isLoadingPersonalInfo = false;
        this.mapStudentProfileToPersonalInfo(profile);
      },
      error: (error) => {
        this.isLoadingPersonalInfo = false;
        this.personalInfoError = 'Failed to load personal information.';
        console.error('Error loading student profile:', error);
      }
    });
  }

  private loadTrainerPersonalInfo(): void {
    this.authService.getTrainerProfile().subscribe({
      next: (profile: any) => {
        this.isLoadingPersonalInfo = false;
        this.mapTrainerProfileToPersonalInfo(profile);
      },
      error: (error) => {
        this.isLoadingPersonalInfo = false;
        this.personalInfoError = 'Failed to load personal information.';
        console.error('Error loading trainer profile:', error);
      }
    });
  }

  private loadInstitutionPersonalInfo(): void {
    // For institutions, we can use a similar approach
    // This would need an institution service method
    this.isLoadingPersonalInfo = false;
    const user = this.authService.getCurrentUserValue();
    if (user) {
      this.personalInfo = {
        ...this.personalInfo,
        firstName: user.firstName,
        lastName: user.lastName || '',
        email: user.email,
        phone: user.phone || '',
        bio: user.bio || ''
      };
    }
  }

  loadAccountSettings(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    const user = this.authService.getCurrentUserValue();
    if (!user || user.role !== 'student') {
      return;
    }

    this.isLoadingAccountSettings = true;
    this.accountSettingsError = '';

    this.studentService.getAccountSettings().subscribe({
      next: (settings) => {
        this.accountSettings = {
          ...this.accountSettings,
          ...settings
        };
        this.isLoadingAccountSettings = false;
      },
      error: (error) => {
        console.error('Error loading account settings:', error);
        this.accountSettingsError = error.message || 'Failed to load account settings.';
        this.isLoadingAccountSettings = false;
      }
    });
  }

  private mapStudentProfileToPersonalInfo(profile: StudentProfile): void {
    const nameParts = profile.name ? profile.name.split(' ') : [];
    this.personalInfo = {
      profilePicture: (profile.avatar && profile.avatar.trim()) || '',
      firstName: profile.firstName || nameParts[0] || '',
      lastName: profile.lastName || nameParts.slice(1).join(' ') || '',
      email: profile.email || '',
      phone: profile.phone || '',
      alternatePhone: profile.alternatePhone || '',
      dateOfBirth: profile.dateOfBirth ? (typeof profile.dateOfBirth === 'string' ? profile.dateOfBirth : new Date(profile.dateOfBirth).toISOString().split('T')[0]) : '',
      gender: profile.gender || '',
      maritalStatus: profile.maritalStatus || '',
      nationality: profile.nationality || profile.country || '',
      address: {
        street: profile.address?.street || '',
        city: profile.address?.city || profile.city || '',
        state: profile.address?.state || '',
        pincode: profile.address?.pincode || '',
        country: profile.address?.country || profile.country || ''
      },
      education: profile.highestQualification || '',
      occupation: profile.occupation || '',
      company: profile.company || '',
      experience: profile.experience || '',
      skills: profile.skills || [],
      linkedin: profile.linkedin || '',
      github: profile.github || '',
      portfolio: profile.portfolio || '',
      emergencyContact: {
        name: profile.emergencyContact?.name || '',
        relationship: profile.emergencyContact?.relationship || '',
        phone: profile.emergencyContact?.phone || '',
        email: profile.emergencyContact?.email || ''
      },
      bio: profile.bio || profile.aboutYou || ''
    };
  }

  private mapTrainerProfileToPersonalInfo(profile: any): void {
    const nameParts = profile.name ? profile.name.split(' ') : [];
    this.personalInfo = {
      profilePicture: (profile.avatar && profile.avatar.trim()) || '',
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: profile.email || '',
      phone: profile.phone || '',
      alternatePhone: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      nationality: profile.location || '',
      address: {
        street: '',
        city: profile.location || '',
        state: '',
        pincode: '',
        country: ''
      },
      education: '',
      occupation: profile.title || '',
      company: '',
      experience: profile.experienceYears ? `${profile.experienceYears} years` : '',
      skills: profile.skills ? profile.skills.map((s: any) => s.name || s) : [],
      linkedin: profile.linkedin || '',
      github: '',
      portfolio: profile.website || '',
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
        email: ''
      },
      bio: profile.bio || ''
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Load account data
  loadAccountData(): void {
    this.loading = true;
    this.error = '';

    // Load account overview
    const overviewSub = this.accountService.getAccountOverview().subscribe({
      next: (data) => {
        this.accountOverview = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading account overview:', error);
        this.error = 'Failed to load account data';
        this.loading = false;
      }
    });

    // Load user profile
    const profileSub = this.accountService.getUserProfile().subscribe({
      next: (data) => {
        this.userProfile = data;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });

    // Load account stats
    const statsSub = this.accountService.getAccountStats().subscribe({
      next: (data) => {
        this.accountStats = data;
      },
      error: (error) => {
        console.error('Error loading account stats:', error);
      }
    });

    // Load orders
    this.isLoadingOrders = true;
    const ordersSub = this.accountService.getRecentOrders(10).subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoadingOrders = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoadingOrders = false;
      }
    });

    // Load learning progress
    const progressSub = this.accountService.getLearningProgress().subscribe({
      next: (data) => {
        this.courseDetails = data;
      },
      error: (error) => {
        console.error('Error loading learning progress:', error);
      }
    });

    // Load support tickets
    this.loadSupportTickets();

    this.subscriptions.push(overviewSub, profileSub, statsSub, ordersSub, progressSub);
  }
  
  // Load support tickets
  loadSupportTickets(): void {
    this.isLoadingTickets = true;
    this.ticketsError = '';
    
    const ticketsSub = this.supportTicketService.getMyTickets().subscribe({
      next: (tickets) => {
        this.supportTickets = tickets;
        this.isLoadingTickets = false;
      },
      error: (error) => {
        console.error('Error loading support tickets:', error);
        this.ticketsError = error.error?.message || 'Failed to load support tickets';
        this.supportTickets = [];
        this.isLoadingTickets = false;
      }
    });
    
    this.subscriptions.push(ticketsSub);
  }

  // Navigation methods
  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  // Notification system
  showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    // Set background color based on type
    switch (type) {
      case 'success':
        notification.style.backgroundColor = '#28a745';
        break;
      case 'error':
        notification.style.backgroundColor = '#dc3545';
        break;
      case 'info':
        notification.style.backgroundColor = '#17a2b8';
        break;
      case 'warning':
        notification.style.backgroundColor = '#ffc107';
        notification.style.color = '#000';
        break;
    }

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Additional methods
  enrollCourse(courseId: string): void {
    this.router.navigate(['/Course-details', courseId]);
  }

  browseCourses(): void {
    this.router.navigate(['/Courses']);
  }

  updateSocialLinks(): void {
    console.log('Updating social links...');
    this.showNotification('Social links updated successfully!', 'success');
  }

  connectSocial(platform: string): void {
    console.log('Connecting to platform:', platform);
    this.showNotification(platform + ' connection initiated!', 'info');    
  }

  updateEmergencyContacts(): void {
    console.log('Adding new emergency contact...');
    this.showNotification('Emergency contact added successfully!', 'success');                                                                              
  }

  editEmergencyContact(contactId: number): void {
    console.log('Editing emergency contact:', contactId);
    this.showNotification('Emergency contact updated!', 'success');        
  }

  deleteEmergencyContact(contactId: number): void {
    if (confirm('Are you sure you want to delete this emergency contact?')) {
      console.log('Deleting emergency contact:', contactId);
      this.showNotification('Emergency contact deleted!', 'success');      
    }
  }

  updateLearningPreferences(): void {
    console.log('Updating learning preferences...');
    this.showNotification('Learning preferences saved successfully!', 'success');                                                                          
  }

  downloadAllCertificates(): void {
    console.log('Downloading all certificates...');
    this.showNotification('All certificates downloaded successfully!', 'success');                                                                         
  }

  viewCertificate(certificateId: string): void {
    console.log('Viewing certificate:', certificateId);
    this.showNotification('Certificate opened in new tab!', 'info');       
  }

  downloadCertificate(course: any): void {
    if (!course) {
      this.showNotification('Course information not available', 'error');
      return;
    }

    // Set loading state
    this.downloadingCertificateId = course.id;

    try {
      // Check if certificate URL exists
      if (course.certificate && course.certificate !== 'Not Available' && course.certificate !== '') {
        this.downloadCertificateFromUrl(course.certificate, course.courseName);
        return;
      }

      // Check if certificateUrl exists in courseDetails
      if (course.courseDetails?.certificateUrl) {
        this.downloadCertificateFromUrl(course.courseDetails.certificateUrl, course.courseName);
        return;
      }

      // If no certificate URL, generate a certificate
      if (course.progress >= 100 || course.status === 'completed') {
        this.generateAndDownloadCertificate(course);
      } else {
        this.showNotification('Certificate is not available yet. Complete the course to earn your certificate!', 'warning');
        this.downloadingCertificateId = null;
      }
    } catch (error) {
      console.error('Error in downloadCertificate:', error);
      this.showNotification('Failed to download certificate. Please try again.', 'error');
      this.downloadingCertificateId = null;
    }
  }

  downloadIdCard(course: any): void {
    if (!course) {
      this.showNotification('Course information not available', 'error');
      return;
    }

    this.downloadingIdCardId = course.id;

    this.generateAndDownloadIdCard(course)
      .then(() => {
        this.showNotification('ID card downloaded successfully!', 'success');
        this.downloadingIdCardId = null;
      })
      .catch((error) => {
        console.error('Error generating ID card:', error);
        this.showNotification('Failed to generate ID card. Please try again.', 'error');
        this.downloadingIdCardId = null;
      });
  }

  private async generateAndDownloadIdCard(course: any): Promise<void> {
    const canvas = document.createElement('canvas');
    const width = 900;
    const height = 560;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    // Card background
    drawRoundedRect(20, 20, width - 40, height - 40, 22);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#dbeafe';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Header band
    const headerHeight = 110;
    const gradient = ctx.createLinearGradient(20, 20, width - 20, 20);
    gradient.addColorStop(0, '#1d4ed8');
    gradient.addColorStop(1, '#3b82f6');
    drawRoundedRect(20, 20, width - 40, headerHeight, 22);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Logo
    const logo = await this.loadImage('/assets/photos/techwindows_logo.png');
    ctx.drawImage(logo, 40, 40, 140, 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillText('TECHWINDOWS STUDENT ID', 200, 68);
    ctx.font = '14px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Issued by TechWindows Academy', 200, 92);

    // Profile photo
    const photoSrc = this.getSafeImageSrc(this.profilePicturePreview || this.personalInfo.profilePicture);
    const profileImg = await this.loadImage(photoSrc);
    const photoX = 60;
    const photoY = 170;
    const photoSize = 140;
    ctx.save();
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(profileImg, photoX, photoY, photoSize, photoSize);
    ctx.restore();
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + 4, 0, Math.PI * 2);
    ctx.stroke();

    // Student details
    const infoX = 230;
    let infoY = 170;
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
    ctx.fillText(this.getStudentDisplayName(), infoX, infoY);

    ctx.font = '16px "Segoe UI", Arial, sans-serif';
    infoY += 32;
    ctx.fillStyle = '#475569';
    ctx.fillText(`Student ID: ${this.buildStudentCardId(course)}`, infoX, infoY);
    infoY += 26;
    ctx.fillText(`Course: ${course.courseName || 'Course'}`, infoX, infoY);
    infoY += 26;
    ctx.fillText(`Instructor: ${course.instructor || 'N/A'}`, infoX, infoY);
    infoY += 26;
    ctx.fillText(`Enrollment: ${this.formatDate(course.enrollmentDate || course.startDate)}`, infoX, infoY);

    const validTill = this.getValidTillDate(course.enrollmentDate || course.startDate);
    infoY += 26;
    ctx.fillText(`Valid Till: ${this.formatDate(validTill)}`, infoX, infoY);

    // Footer band
    ctx.fillStyle = '#eff6ff';
    drawRoundedRect(40, height - 120, width - 80, 80, 16);
    ctx.fill();
    ctx.strokeStyle = '#bfdbfe';
    ctx.stroke();

    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
    ctx.fillText('TechWindows Academy', 60, height - 78);
    ctx.font = '14px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Official Student Identification Card', 60, height - 54);

    const dataUrl = canvas.toDataURL('image/png');
    this.downloadDataUrl(dataUrl, `TechWindows-ID-${course.courseName || 'Course'}.png`);
  }

  private getStudentDisplayName(): string {
    const firstName = this.personalInfo.firstName || '';
    const lastName = this.personalInfo.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName) {
      return fullName;
    }
    return this.userProfile?.name || 'Student';
  }

  private buildStudentCardId(course: any): string {
    const userId = this.authService.getCurrentUserValue()?.id || this.userProfile?.id || course?.enrollmentId || course?.id || '000000';
    const tail = String(userId).replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase();
    return `TW-${tail || '000000'}`;
  }

  private getValidTillDate(dateValue: any): Date {
    const base = dateValue ? new Date(dateValue) : new Date();
    const valid = new Date(base);
    valid.setFullYear(valid.getFullYear() + 1);
    return valid;
  }

  private getSafeImageSrc(src?: string): string {
    if (!src) {
      return '/assets/photos/default-avatar.png';
    }
    if (src.startsWith('data:') || src.startsWith('/assets')) {
      return src;
    }
    if (typeof window !== 'undefined' && src.startsWith(window.location.origin)) {
      return src;
    }
    return '/assets/photos/default-avatar.png';
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  private downloadDataUrl(dataUrl: string, fileName: string): void {
    const safeName = fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = safeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private downloadCertificateFromUrl(certificateUrl: string, courseName: string): void {
    try {
      // If it's a full URL, download directly
      if (certificateUrl.startsWith('http://') || certificateUrl.startsWith('https://')) {
        this.downloadFile(certificateUrl, courseName);
      } else {
        // If it's a relative path, use API service
        const endpoint = certificateUrl.startsWith('/') ? certificateUrl : `/certificates/${certificateUrl}`;
        this.downloadCertificateFromAPI(endpoint, courseName);
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      this.showNotification('Failed to download certificate. Please try again.', 'error');
    }
  }

  private downloadCertificateFromAPI(endpoint: string, courseName: string): void {
    this.apiService.getBlob(endpoint).subscribe({
      next: (blob: Blob) => {
        this.saveBlobAsFile(blob, courseName);
        this.showNotification('Certificate downloaded successfully!', 'success');
        this.downloadingCertificateId = null;
      },
      error: (error) => {
        console.error('Error downloading certificate from API:', error);
        this.downloadingCertificateId = null;
        // Fallback: try to generate certificate if course is completed
        this.showNotification('Certificate file not found. Generating certificate...', 'info');
        // You can implement certificate generation here if needed
      }
    });
  }

  private downloadFile(url: string, courseName: string): void {
    // Determine file extension from URL
    const extension = url.toLowerCase().endsWith('.pdf') ? 'pdf' : 
                     url.toLowerCase().endsWith('.png') ? 'png' : 
                     url.toLowerCase().endsWith('.jpg') || url.toLowerCase().endsWith('.jpeg') ? 'jpg' : 'pdf';
    
    const link = document.createElement('a');
    link.href = url;
    link.download = this.getCertificateFileName(courseName, extension);
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showNotification('Certificate downloaded successfully!', 'success');
    this.downloadingCertificateId = null;
  }

  private generateAndDownloadCertificate(course: any): void {
    // Generate an HTML certificate
    // Note: For PDF generation, you would need a library like jsPDF or html2pdf
    try {
      const certificateContent = this.generateCertificateHTML(course);
      const blob = new Blob([certificateContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = this.getCertificateFileName(course.courseName, 'html');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      this.showNotification('Certificate generated and downloaded successfully!', 'success');
      this.downloadingCertificateId = null;
    } catch (error) {
      console.error('Error generating certificate:', error);
      this.showNotification('Failed to generate certificate. Please try again.', 'error');
      this.downloadingCertificateId = null;
    }
  }

  private generateCertificateHTML(course: any): string {
    const userName = this.userProfile?.name || this.personalInfo?.firstName + ' ' + this.personalInfo?.lastName || 'Student';
    const courseName = course.courseName || 'Course';
    const completionDate = course.endDate ? new Date(course.endDate).toLocaleDateString() : new Date().toLocaleDateString();
    const grade = course.grade || 'A';
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificate of Completion</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    body {
      font-family: 'Times New Roman', serif;
      margin: 0;
      padding: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .certificate {
      background: white;
      padding: 60px;
      border: 20px solid #d4af37;
      box-shadow: 0 0 30px rgba(0,0,0,0.3);
      text-align: center;
      max-width: 900px;
      position: relative;
    }
    .certificate::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 2px solid #d4af37;
    }
    h1 {
      font-size: 48px;
      color: #2c3e50;
      margin-bottom: 20px;
      font-weight: bold;
    }
    .subtitle {
      font-size: 24px;
      color: #7f8c8d;
      margin-bottom: 40px;
    }
    .name {
      font-size: 36px;
      color: #2c3e50;
      margin: 30px 0;
      font-weight: bold;
      text-decoration: underline;
      text-decoration-color: #d4af37;
    }
    .course-name {
      font-size: 28px;
      color: #34495e;
      margin: 20px 0;
      font-style: italic;
    }
    .details {
      font-size: 18px;
      color: #7f8c8d;
      margin-top: 40px;
      line-height: 1.8;
    }
    .date {
      margin-top: 50px;
      font-size: 16px;
      color: #95a5a6;
    }
    .signature {
      margin-top: 60px;
      display: flex;
      justify-content: space-around;
    }
    .signature div {
      text-align: center;
    }
    .signature-line {
      border-top: 2px solid #2c3e50;
      width: 200px;
      margin: 40px auto 10px;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <h1>CERTIFICATE OF COMPLETION</h1>
    <div class="subtitle">This is to certify that</div>
    <div class="name">${userName}</div>
    <div class="subtitle">has successfully completed the course</div>
    <div class="course-name">${courseName}</div>
    <div class="details">
      <p>Grade Achieved: <strong>${grade}</strong></p>
      <p>Progress: <strong>${course.progress || 100}%</strong></p>
      <p>Completed Modules: <strong>${course.completedModules || course.totalModules} / ${course.totalModules}</strong></p>
    </div>
    <div class="date">
      <p>Date of Completion: ${completionDate}</p>
    </div>
    <div class="signature">
      <div>
        <div class="signature-line"></div>
        <p>Instructor</p>
        <p>${course.instructor || 'Course Instructor'}</p>
      </div>
      <div>
        <div class="signature-line"></div>
        <p>TechWindows Academy</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }

  private saveBlobAsFile(blob: Blob, courseName: string): void {
    // Determine file extension from blob type
    let extension = 'pdf';
    if (blob.type.includes('pdf')) {
      extension = 'pdf';
    } else if (blob.type.includes('png')) {
      extension = 'png';
    } else if (blob.type.includes('jpeg') || blob.type.includes('jpg')) {
      extension = 'jpg';
    } else if (blob.type.includes('html')) {
      extension = 'html';
    }
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.getCertificateFileName(courseName, extension);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private getCertificateFileName(courseName: string, extension: string = 'html'): string {
    const sanitizedName = courseName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const date = new Date().toISOString().split('T')[0];
    return `certificate_${sanitizedName}_${date}.${extension}`;
  }

  shareCertificate(certificateId: string): void {
    console.log('Sharing certificate:', certificateId);
    this.showNotification('Certificate shared successfully!', 'success');  
  }

  updatePrivacySettings(): void {
    console.log('Updating privacy settings...');
    this.showNotification('Privacy settings saved successfully!', 'success');                                                                              
  }

  exportUserData(): void {
    console.log('Exporting user data...');
    this.showNotification('User data export initiated! Check your email.', 'info');                                                                        
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {                                                          
      console.log('Account deletion requested...');
      this.showNotification('Account deletion request submitted!', 'error');                                                                               
    }
  }

  changeProfilePicture(): void {
    console.log('Changing profile picture...');
    this.showNotification('Profile picture updated successfully!', 'success');                                                                             
  }

  exploreCategories(): void {
    this.router.navigate(['/Courses']);
  }

  // Missing methods for template
  isActiveSection(section: string): boolean {
    return this.activeSection === section;
  }

  getWishlistCount(): number {
    return this.wishlistItems.length;
  }

  formatCurrency(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatDate(date: string | Date | undefined | null): string {
    if (!date) {
      return 'N/A';
    }
    const normalized = date instanceof Date ? date : new Date(date);
    return normalized.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'resolved':
        return 'success';
      case 'in progress':
      case 'open':
        return 'warning';
      case 'cancelled':
      case 'closed':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  loadAccountOverview(): void {
    this.loadAccountData();
  }

  viewOrderDetails(orderId: string): void {
    // Find the order/enrollment in the current list
    const order = this.orders.find(o => o.id === orderId);
    
    if (!order) {
      this.showNotification('Order details not found', 'error');
      return;
    }

    // If it's an enrollment-based order, show enrollment payment details
    if (order.enrollment) {
      this.showEnrollmentPaymentDetails(order);
    } else {
      // Fallback to order details API if available
      this.showPaymentModal = true;
      this.isLoadingPaymentDetails = true;
      this.paymentDetailsError = '';
      this.paymentDetails = null;

      this.accountService.getPaymentDetails(orderId).subscribe({
        next: (details) => {
          this.paymentDetails = details;
          this.isLoadingPaymentDetails = false;
        },
        error: (error) => {
          console.error('Error loading payment details:', error);
          this.paymentDetailsError = error.error?.message || 'Failed to load payment details. Please try again.';
          this.isLoadingPaymentDetails = false;
        }
      });
    }
  }

  private showEnrollmentPaymentDetails(order: Order): void {
    this.showPaymentModal = true;
    this.isLoadingPaymentDetails = false;
    this.paymentDetailsError = '';
    
    // Transform enrollment data to PaymentDetails format
    const enrollment = order.enrollment!;
    const paymentDetails = order.paymentDetails!;
    
    this.paymentDetails = {
      id: enrollment.id,
      orderNumber: order.orderNumber || paymentDetails.transactionId || enrollment.transactionId,
      studentId: '', // Will be populated from auth if needed
      courseId: enrollment.id,
      courseName: order.courseName,
      amount: order.amount,
      discount: 0,
      tax: 0,
      totalAmount: order.amount,
      currency: 'INR',
      status: order.status === 'Completed' ? 'completed' : 'processing',
      paymentMethod: this.mapPaymentMethodToEnum(order.paymentMethod),
      paymentStatus: paymentDetails.paymentStatus === 'paid' ? 'paid' : 'pending',
      paymentDetails: {
        transactionId: paymentDetails.transactionId || enrollment.transactionId,
        paymentGateway: '',
        cardLast4: '',
        cardBrand: '',
        upiId: '',
        bankName: '',
        paymentDate: paymentDetails.paymentDate || enrollment.enrollmentDate,
        paymentReference: ''
      },
      invoiceNumber: order.invoice || '',
      invoiceUrl: '',
      billingAddress: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      notes: `Enrollment Status: ${enrollment.enrollmentStatus} | Course Type: ${enrollment.courseType} | Progress: ${enrollment.progress}%`,
      refundAmount: undefined,
      refundDate: undefined,
      refundReason: undefined,
      orderHistory: [{
        date: enrollment.enrollmentDate,
        status: enrollment.enrollmentStatus,
        description: `Course enrolled: ${order.courseName}`
      }],
      createdAt: enrollment.enrollmentDate,
      updatedAt: enrollment.enrollmentDate
    };
  }

  private mapPaymentMethodToEnum(method: string): 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet' | 'cash' | 'paypal' | 'stripe' {
    const methodMap: { [key: string]: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet' | 'cash' | 'paypal' | 'stripe' } = {
      'Credit Card': 'credit_card',
      'Debit Card': 'debit_card',
      'UPI': 'upi',
      'Net Banking': 'net_banking',
      'Wallet': 'wallet',
      'Cash': 'cash',
      'PayPal': 'paypal',
      'Stripe': 'stripe'
    };
    return methodMap[method] || 'upi';
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.paymentDetails = null;
    this.paymentDetailsError = '';
  }

  formatPaymentMethod(method: string): string {
    const methodMap: { [key: string]: string } = {
      'credit_card': 'Credit Card',
      'debit_card': 'Debit Card',
      'upi': 'UPI',
      'net_banking': 'Net Banking',
      'wallet': 'Wallet',
      'cash': 'Cash',
      'paypal': 'PayPal',
      'stripe': 'Stripe'
    };
    return methodMap[method] || method;
  }

  getPaymentStatusColor(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'warning',
      'paid': 'success',
      'failed': 'danger',
      'refunded': 'info',
      'partially_refunded': 'warning'
    };
    return statusMap[status] || 'secondary';
  }

  getEnrollmentStatusColor(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'success',
      'completed': 'primary',
      'cancelled': 'danger',
      'paused': 'warning'
    };
    return statusMap[status.toLowerCase()] || 'secondary';
  }

  getPriorityColor(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'Low': 'secondary',
      'Medium': 'info',
      'High': 'warning',
      'Urgent': 'danger'
    };
    return priorityMap[priority] || 'secondary';
  }

  downloadInvoice(invoiceIdOrOrderId: string): void {
    if (!invoiceIdOrOrderId) {
      this.showNotification('Invoice ID not found', 'error');
      return;
    }

    // Find the order/enrollment by invoice ID or order ID
    const order = this.orders.find(o => 
      o.invoice === invoiceIdOrOrderId || 
      o.id === invoiceIdOrOrderId ||
      o.orderNumber === invoiceIdOrOrderId ||
      (o.paymentDetails?.transactionId && o.paymentDetails.transactionId.includes(invoiceIdOrOrderId))
    );

    if (!order) {
      this.showNotification('Order not found for invoice generation', 'error');
      return;
    }

    // Generate and download invoice
    this.generateInvoicePDF(order);
  }

  private generateInvoicePDF(order: Order): void {
    // Get user profile for billing information
    const user = this.userProfile;
    const enrollment = order.enrollment;
    const paymentDetails = order.paymentDetails;

    // Generate invoice HTML
    const invoiceHTML = this.generateInvoiceHTML(order, user, enrollment, paymentDetails);

    // Create a new window and write the invoice HTML
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      this.showNotification('Please allow pop-ups to download invoice', 'error');
      return;
    }

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();

    // Wait for content to load, then trigger print
    setTimeout(() => {
      printWindow.print();
      this.showNotification('Invoice opened for printing/download', 'success');
    }, 250);
  }

  private generateInvoiceHTML(order: Order, user: UserProfile | null, enrollment: any, paymentDetails: any): string {
    const invoiceNumber = order.invoice || order.orderNumber || `INV-${order.id.substring(0, 8)}`;
    const transactionId = paymentDetails?.transactionId || enrollment?.transactionId || 'N/A';
    const invoiceDate = new Date(order.date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const paymentDate = paymentDetails?.paymentDate 
      ? new Date(paymentDetails.paymentDate).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : invoiceDate;

    const userName = user?.name || 'Student';
    const userEmail = user?.email || '';
    const userPhone = user?.phone || '';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      background: #fff;
      padding: 40px;
      line-height: 1.6;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      border: 1px solid #e0e0e0;
      padding: 40px;
    }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #007bff;
    }
    .company-info h1 {
      color: #007bff;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .company-info p {
      color: #666;
      font-size: 14px;
      margin: 5px 0;
    }
    .invoice-title {
      text-align: right;
    }
    .invoice-title h2 {
      font-size: 32px;
      color: #333;
      margin-bottom: 10px;
    }
    .invoice-title p {
      color: #666;
      font-size: 14px;
    }
    .invoice-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
    }
    .billing-info, .invoice-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 5px;
    }
    .billing-info h3, .invoice-info h3 {
      color: #007bff;
      margin-bottom: 15px;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .billing-info p, .invoice-info p {
      margin: 8px 0;
      color: #555;
      font-size: 14px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .items-table thead {
      background: #007bff;
      color: #fff;
    }
    .items-table th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
    }
    .items-table td {
      padding: 15px;
      border-bottom: 1px solid #e0e0e0;
      font-size: 14px;
    }
    .items-table tbody tr:hover {
      background: #f8f9fa;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .summary-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 40px;
    }
    .summary-box {
      width: 300px;
      background: #f8f9fa;
      padding: 20px;
      border-radius: 5px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e0e0e0;
    }
    .summary-row:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .summary-row.total {
      font-size: 18px;
      font-weight: bold;
      color: #007bff;
      border-top: 2px solid #007bff;
      padding-top: 10px;
      margin-top: 10px;
    }
    .payment-info {
      background: #e8f4f8;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 30px;
    }
    .payment-info h3 {
      color: #007bff;
      margin-bottom: 15px;
      font-size: 16px;
    }
    .payment-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .payment-info-item {
      display: flex;
      flex-direction: column;
    }
    .payment-info-item label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .payment-info-item span {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 3px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-success {
      background: #28a745;
      color: #fff;
    }
    .badge-warning {
      background: #ffc107;
      color: #333;
    }
    @media print {
      body {
        padding: 20px;
      }
      .invoice-container {
        border: none;
        padding: 20px;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <div class="company-info">
        <h1>TechWindows</h1>
        <p>Online Learning Platform</p>
        <p>Email: support@techwindows.com</p>
        <p>Phone: +91-1234567890</p>
      </div>
      <div class="invoice-title">
        <h2>INVOICE</h2>
        <p>Invoice #: ${invoiceNumber}</p>
        <p>Date: ${invoiceDate}</p>
      </div>
    </div>

    <div class="invoice-details">
      <div class="billing-info">
        <h3>Bill To</h3>
        <p><strong>${userName}</strong></p>
        <p>${userEmail}</p>
        <p>${userPhone}</p>
      </div>
      <div class="invoice-info">
        <h3>Invoice Details</h3>
        <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p><strong>Invoice Date:</strong> ${invoiceDate}</p>
        <p><strong>Payment Date:</strong> ${paymentDate}</p>
        <p><strong>Status:</strong> <span class="badge badge-success">${order.status}</span></p>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th class="text-center">Course Type</th>
          <th class="text-center">Level</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${order.courseName}</strong>
            ${enrollment?.instructorName ? `<br><small>Instructor: ${enrollment.instructorName}</small>` : ''}
            ${enrollment?.institutionName ? `<br><small>Institution: ${enrollment.institutionName}</small>` : ''}
          </td>
          <td class="text-center">${enrollment?.courseType ? enrollment.courseType.charAt(0).toUpperCase() + enrollment.courseType.slice(1) : 'N/A'}</td>
          <td class="text-center">${enrollment?.courseLevel || 'N/A'}</td>
          <td class="text-right">₹${order.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>

    <div class="summary-section">
      <div class="summary-box">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>₹${order.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="summary-row">
          <span>Tax (GST):</span>
          <span>₹0.00</span>
        </div>
        <div class="summary-row">
          <span>Discount:</span>
          <span>₹0.00</span>
        </div>
        <div class="summary-row total">
          <span>Total Amount:</span>
          <span>₹${order.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>

    <div class="payment-info">
      <h3>Payment Information</h3>
      <div class="payment-info-grid">
        <div class="payment-info-item">
          <label>Payment Method</label>
          <span>${order.paymentMethod}</span>
        </div>
        <div class="payment-info-item">
          <label>Payment Status</label>
          <span class="badge ${paymentDetails?.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}">${paymentDetails?.paymentStatus || 'Paid'}</span>
        </div>
        <div class="payment-info-item">
          <label>Transaction ID</label>
          <span>${transactionId}</span>
        </div>
        <div class="payment-info-item">
          <label>Amount Paid</label>
          <span>₹${order.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>

    ${enrollment ? `
    <div class="payment-info" style="background: #f0f8ff;">
      <h3>Enrollment Information</h3>
      <div class="payment-info-grid">
        <div class="payment-info-item">
          <label>Enrollment Status</label>
          <span class="badge badge-success">${enrollment.enrollmentStatus || 'Active'}</span>
        </div>
        <div class="payment-info-item">
          <label>Progress</label>
          <span>${enrollment.progress || 0}% Complete</span>
        </div>
        <div class="payment-info-item">
          <label>Enrollment Date</label>
          <span>${new Date(enrollment.enrollmentDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div class="payment-info-item">
          <label>Course Level</label>
          <span>${enrollment.courseLevel || 'N/A'}</span>
        </div>
      </div>
    </div>
    ` : ''}

    <div class="footer">
      <p><strong>Thank you for your business!</strong></p>
      <p>This is a computer-generated invoice and does not require a signature.</p>
      <p>For any queries, please contact support@techwindows.com</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  updatePersonalInfo(): void {
    if (this.isEditingPersonalInfo) {
      this.savePersonalInfo();
    } else {
      // Enter edit mode
      this.isEditingPersonalInfo = true;
      this.personalInfoForm = { 
        ...this.personalInfo,
        skills: Array.isArray(this.personalInfo.skills) 
          ? this.personalInfo.skills.join(', ') 
          : (this.personalInfo.skills || ''),
        emergencyContact: this.personalInfo.emergencyContact || {},
        address: this.personalInfo.address || {}
      };
      this.profilePicturePreview = this.personalInfo.profilePicture || '';
      // Initialize profilePicture in form to track removal
      this.personalInfoForm.profilePicture = this.personalInfo.profilePicture || '';
    }
  }

  private savePersonalInfo(): void {
    this.isSavingPersonalInfo = true;
    this.personalInfoError = '';

    // Convert skills string to array if needed
    if (typeof this.personalInfoForm.skills === 'string') {
      this.personalInfoForm.skills = this.personalInfoForm.skills
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
    }

    const user = this.authService.getCurrentUserValue();
    if (!user) {
      this.isSavingPersonalInfo = false;
      this.personalInfoError = 'User not authenticated.';
      return;
    }

    if (user.role === 'student') {
      this.saveStudentPersonalInfo();
    } else if (user.role === 'trainer') {
      this.saveTrainerPersonalInfo();
    } else {
      this.isSavingPersonalInfo = false;
      this.personalInfoError = 'Update not supported for this user type.';
    }
  }

  private saveStudentPersonalInfo(): void {
    // Determine avatar value: use preview if new image selected, otherwise keep existing or set to empty string if removed
    let avatarValue: string | undefined = undefined;
    if (this.profilePicturePreview) {
      // New image selected
      avatarValue = this.profilePicturePreview;
    } else if (this.personalInfoForm.profilePicture === '' && this.profilePictureFile === null) {
      // Image was removed
      avatarValue = '';
    } else {
      // Keep existing image
      avatarValue = this.personalInfo.profilePicture || undefined;
    }

    const payload: Partial<StudentProfile> = {
      firstName: this.personalInfoForm.firstName?.trim() || '',
      lastName: this.personalInfoForm.lastName?.trim() || '',
      email: this.personalInfoForm.email?.trim() || '',
      phone: this.personalInfoForm.phone?.trim() || '',
      alternatePhone: this.personalInfoForm.alternatePhone?.trim() || '',
      dateOfBirth: this.personalInfoForm.dateOfBirth || undefined,
      gender: this.personalInfoForm.gender || '',
      maritalStatus: this.personalInfoForm.maritalStatus || '',
      nationality: this.personalInfoForm.nationality?.trim() || '',
      city: this.personalInfoForm.address?.city?.trim() || '',
      country: this.personalInfoForm.address?.country?.trim() || this.personalInfoForm.nationality?.trim() || '',
      address: {
        street: this.personalInfoForm.address?.street?.trim() || '',
        city: this.personalInfoForm.address?.city?.trim() || '',
        state: this.personalInfoForm.address?.state?.trim() || '',
        pincode: this.personalInfoForm.address?.pincode?.trim() || '',
        country: this.personalInfoForm.address?.country?.trim() || ''
      },
      highestQualification: this.personalInfoForm.education?.trim() || '',
      occupation: this.personalInfoForm.occupation?.trim() || '',
      company: this.personalInfoForm.company?.trim() || '',
      experience: this.personalInfoForm.experience?.trim() || '',
      bio: this.personalInfoForm.bio?.trim() || '',
      skills: Array.isArray(this.personalInfoForm.skills) ? this.personalInfoForm.skills : [],
      portfolio: this.personalInfoForm.portfolio?.trim() || '',
      linkedin: this.personalInfoForm.linkedin?.trim() || '',
      github: this.personalInfoForm.github?.trim() || '',
      emergencyContact: {
        name: this.personalInfoForm.emergencyContact?.name?.trim() || '',
        relationship: this.personalInfoForm.emergencyContact?.relationship?.trim() || '',
        phone: this.personalInfoForm.emergencyContact?.phone?.trim() || '',
        email: this.personalInfoForm.emergencyContact?.email?.trim() || ''
      },
      avatar: avatarValue
    };

    this.studentService.updateStudentProfile(payload).subscribe({
      next: (updatedProfile: StudentProfile) => {
        this.isSavingPersonalInfo = false;
        this.mapStudentProfileToPersonalInfo(updatedProfile);
        this.isEditingPersonalInfo = false;
        // Clear file and preview after successful save
        this.profilePictureFile = null;
        this.profilePicturePreview = '';
        this.showNotification('Personal information updated successfully!', 'success');
        
        // Update local user data
        const currentUser = this.authService.getCurrentUserValue();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            firstName: updatedProfile.firstName || currentUser.firstName,
            lastName: updatedProfile.lastName || currentUser.lastName,
            email: updatedProfile.email || currentUser.email,
            phone: updatedProfile.phone || currentUser.phone,
            avatar: updatedProfile.avatar || currentUser.avatar
          };
          this.authService.persistCurrentUser(updatedUser);
        }
      },
      error: (error) => {
        this.isSavingPersonalInfo = false;
        this.personalInfoError = error.error?.message || error.message || 'Failed to update personal information.';
        this.showNotification(this.personalInfoError, 'error');
        console.error('Error updating student profile:', error);
      }
    });
  }

  private saveTrainerPersonalInfo(): void {
    const name = `${this.personalInfoForm.firstName || ''} ${this.personalInfoForm.lastName || ''}`.trim();
    
    // Determine avatar value: use preview if new image selected, otherwise keep existing or set to empty string if removed
    let avatarValue: string | undefined = undefined;
    if (this.profilePicturePreview) {
      // New image selected
      avatarValue = this.profilePicturePreview;
    } else if (this.personalInfoForm.profilePicture === '' && this.profilePictureFile === null) {
      // Image was removed
      avatarValue = '';
    } else {
      // Keep existing image
      avatarValue = this.personalInfo.profilePicture || undefined;
    }

    const payload: any = {
      name: name,
      email: this.personalInfoForm.email?.trim() || '',
      phone: this.personalInfoForm.phone?.trim() || '',
      bio: this.personalInfoForm.bio?.trim() || '',
      location: this.personalInfoForm.address?.city?.trim() || this.personalInfoForm.nationality?.trim() || '',
      title: this.personalInfoForm.occupation?.trim() || '',
      linkedin: this.personalInfoForm.linkedin?.trim() || '',
      website: this.personalInfoForm.portfolio?.trim() || '',
      avatar: avatarValue,
      skills: Array.isArray(this.personalInfoForm.skills) 
        ? this.personalInfoForm.skills.map((skill: string) => ({ name: skill, level: 'intermediate', years: 0 }))
        : []
    };

    this.authService.updateTrainerProfile(payload).subscribe({
      next: (updatedProfile: any) => {
        this.isSavingPersonalInfo = false;
        this.mapTrainerProfileToPersonalInfo(updatedProfile);
        this.isEditingPersonalInfo = false;
        // Clear file and preview after successful save
        this.profilePictureFile = null;
        this.profilePicturePreview = '';
        this.showNotification('Personal information updated successfully!', 'success');
      },
      error: (error) => {
        this.isSavingPersonalInfo = false;
        this.personalInfoError = error.error?.message || error.message || 'Failed to update personal information.';
        this.showNotification(this.personalInfoError, 'error');
        console.error('Error updating trainer profile:', error);
      }
    });
  }

  cancelEditPersonalInfo(): void {
    this.isEditingPersonalInfo = false;
    this.personalInfoForm = {};
    this.profilePictureFile = null;
    this.profilePicturePreview = '';
  }

  onProfilePictureSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
        this.showNotification('Please select a valid image file (JPEG, PNG, GIF, or WebP)', 'error');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showNotification('Image size should be less than 5MB', 'error');
        return;
      }

      this.profilePictureFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicturePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(): void {
    if (!this.profilePictureFile) {
      this.showNotification('Personal information updated successfully!', 'success');
      this.isEditingPersonalInfo = false;
      return;
    }

    // In a real application, you would upload the file to a server
    // For now, we'll simulate the upload by storing it as a data URL
    this.personalInfo.profilePicture = this.profilePicturePreview;
    this.showNotification('Profile picture and personal information updated successfully!', 'success');
    this.isEditingPersonalInfo = false;
    this.profilePictureFile = null;
  }

  removeProfilePicture(): void {
    this.profilePictureFile = null;
    this.profilePicturePreview = '';
    this.personalInfoForm.profilePicture = '';
    // Also clear the current profile picture so it shows as empty
    this.personalInfo.profilePicture = '';
  }

  updateAccountSettings(): void {
    if (this.isSavingAccountSettings || this.isLoadingAccountSettings) {
      return;
    }

    this.isSavingAccountSettings = true;
    this.accountSettingsError = '';

    this.studentService.updateAccountSettings(this.accountSettings).subscribe({
      next: (settings) => {
        this.accountSettings = settings;
        this.isSavingAccountSettings = false;
        this.showNotification('Account settings updated successfully!', 'success');
      },
      error: (error) => {
        console.error('Error updating account settings:', error);
        this.accountSettingsError = error.message || 'Failed to update account settings.';
        this.isSavingAccountSettings = false;
        this.showNotification(this.accountSettingsError, 'error');
      }
    });
  }

  toggleTwoFactorAuth(): void {
    this.showNotification(
      'Two-factor authentication ' + (this.accountSettings.twoFactorAuth ? 'enabled' : 'disabled'),
      'info'
    );
  }

  continueCourse(courseName: string): void {
    console.log('Continuing course:', courseName);
    this.showNotification('Redirecting to course...', 'info');
  }

  toggleCourseDetails(courseId: string): void {
    if (this.expandedCourseId === courseId) {
      this.expandedCourseId = null;
    } else {
      this.expandedCourseId = courseId;
      this.initializeRatings(courseId);
    }
  }

  isCourseExpanded(courseId: string): boolean {
    return this.expandedCourseId === courseId;
  }

  // Rating methods
  getTrainerRating(courseId: string): TrainerRating | null {
    return this.courseRatings[courseId]?.trainer || null;
  }

  getInstituteRating(courseId: string): InstituteRating | null {
    return this.courseRatings[courseId]?.institute || null;
  }

  initializeRatings(courseId: string): void {
    if (!this.courseRatings[courseId]) {
      this.courseRatings[courseId] = {
        trainer: {
          teaching: 0,
          communication: 0,
          punctuality: 0,
          submitted: false
        },
        institute: {
          teaching: 0,
          facilities: 0,
          placement: 0,
          submitted: false
        }
      };
    }
  }

  setTrainerRating(courseId: string, category: 'teaching' | 'communication' | 'punctuality', rating: number): void {
    if (!this.courseRatings[courseId]) {
      this.initializeRatings(courseId);
    }
    if (this.courseRatings[courseId].trainer) {
      this.courseRatings[courseId].trainer![category] = rating;
    }
  }

  setInstituteRating(courseId: string, category: 'teaching' | 'facilities' | 'placement', rating: number): void {
    if (!this.courseRatings[courseId]) {
      this.initializeRatings(courseId);
    }
    if (this.courseRatings[courseId].institute) {
      this.courseRatings[courseId].institute![category] = rating;
    }
  }

  submitTrainerRating(course: LearningProgress): void {
    const rating = this.courseRatings[course.id]?.trainer;
    if (!rating || rating.submitted) {
      return;
    }

    // Check if all ratings are provided
    if (rating.teaching === 0 || rating.communication === 0 || rating.punctuality === 0) {
      this.showNotification('Please provide ratings for all categories', 'error');
      return;
    }

    // Extract trainer ID from course (assuming instructor name or ID is available)
    // For now, we'll use a placeholder - you may need to adjust based on your data structure
    const trainerId = course.instructor; // This might need to be adjusted

    this.trainersService.updateTrainerRating(
      trainerId,
      rating.teaching,
      rating.communication,
      rating.punctuality
    ).subscribe({
      next: () => {
        if (this.courseRatings[course.id]?.trainer) {
          this.courseRatings[course.id].trainer!.submitted = true;
        }
        this.showNotification('Trainer rating submitted successfully!', 'success');
      },
      error: (error) => {
        console.error('Error submitting trainer rating:', error);
        this.showNotification('Failed to submit trainer rating. Please try again.', 'error');
      }
    });
  }

  submitInstituteRating(course: LearningProgress): void {
    const rating = this.courseRatings[course.id]?.institute;
    if (!rating || rating.submitted) {
      return;
    }

    // Check if all ratings are provided
    if (rating.teaching === 0 || rating.facilities === 0 || rating.placement === 0) {
      this.showNotification('Please provide ratings for all categories', 'error');
      return;
    }

    // Extract institute ID from course
    // For now, we'll use a placeholder - you may need to adjust based on your data structure
    const instituteId = course.id; // This might need to be adjusted

    // Assuming there's an updateInstituteRating method or we use a generic API call
    this.apiService.putAuth<any>(`/institutes/${instituteId}/rating`, {
      teaching: rating.teaching,
      facilities: rating.facilities,
      placement: rating.placement
    }).subscribe({
      next: () => {
        if (this.courseRatings[course.id]?.institute) {
          this.courseRatings[course.id].institute!.submitted = true;
        }
        this.showNotification('Institute rating submitted successfully!', 'success');
      },
      error: (error) => {
        console.error('Error submitting institute rating:', error);
        this.showNotification('Failed to submit institute rating. Please try again.', 'error');
      }
    });
  }

  canSubmitTrainerRating(courseId: string): boolean {
    const rating = this.courseRatings[courseId]?.trainer;
    return rating ? !rating.submitted && rating.teaching > 0 && rating.communication > 0 && rating.punctuality > 0 : false;
  }

  canSubmitInstituteRating(courseId: string): boolean {
    const rating = this.courseRatings[courseId]?.institute;
    return rating ? !rating.submitted && rating.teaching > 0 && rating.facilities > 0 && rating.placement > 0 : false;
  }

  // Wishlist methods - using cart items structure
  wishlistItems: LocalCartItem[] = [];
  recommendedCourses: any[] = [
    {
      title: 'ISTQB Certification Fast Track',
      category: 'Certification Prep',
      duration: '4 Weeks · Self-paced + Live Doubt Clearing',
      price: 6999,
      image: 'assets/photos/courses/course5.jfif',
    },
    {
      title: 'API Testing with Postman & RestAssured',
      category: 'Micro Learning',
      duration: '6 Weeks · Evening Cohort',
      price: 5499,
      image: 'assets/photos/courses/course7.jfif',
    },
  ];
  supportChannels = [
    { icon: 'fa-comments', label: 'Live Chat', detail: 'Avg. wait time: 2 mins' },
    { icon: 'fa-phone-alt', label: 'Call Support', detail: '1800-123-456 | 9 AM - 9 PM' },
    { icon: 'fa-envelope', label: 'Email', detail: 'support@techwindows.ai' },
  ];

  getCourseImagePath(image: string): string {
    return image || 'assets/photos/course-1.jpg';
  }

  viewCourseDetails(courseId: string): void {
    this.router.navigate(['/Course-details', courseId]);
  }

  removeFromWishlist(item: LocalCartItem): void {
    this.localCartService.removeItem(item.id);
    this.showNotification('Item removed from wishlist!', 'success');
  }

  saveForLater(item: LocalCartItem): void {
    console.log('Saving for later:', item.title);
    this.showNotification('Item saved for later!', 'info');
  }

  moveToCart(item: LocalCartItem): void {
    // Item is already in cart (since we're using cart items)
    this.showNotification('Item is already in cart!', 'info');
  }

  getUniqueCategories(): number {
    const categories = new Set(this.wishlistItems.map(item => item.description || 'Uncategorized'));
    return categories.size;
  }

  getTotalValue(): string {
    const total = this.wishlistItems.reduce<number>((sum, item) => {
      const quantity = item.quantity ?? 1;
      return sum + (item.price * quantity);
    }, 0);
    return this.formatCurrency(total);
  }

  get subtotal(): number {
    return this.wishlistItems.reduce((total, item) => {
      const quantity = item.quantity ?? 1;
      return total + item.price * quantity;
    }, 0);
  }

  get discount(): number {
    return this.wishlistItems.reduce((total, item) => {
      if (!item.originalPrice || item.originalPrice <= item.price) {
        return total;
      }
      const quantity = item.quantity ?? 1;
      return total + (item.originalPrice - item.price) * quantity;
    }, 0);
  }

  get taxes(): number {
    return Math.round(this.subtotal * 0.18);
  }

  get total(): number {
    const total = this.subtotal + this.taxes - this.discount;
    return total < 0 ? 0 : total;
  }

  get savingsPercentage(): number {
    if (!this.wishlistItems.length) {
      return 0;
    }
    const originalTotal = this.wishlistItems.reduce(
      (total, item) => {
        const quantity = item.quantity ?? 1;
        return total + (item.originalPrice || item.price) * quantity;
      },
      0
    );
    if (!originalTotal) {
      return 0;
    }
    const savings = originalTotal - this.subtotal;
    const percentage = (savings / originalTotal) * 100;
    return percentage > 0 ? Math.round(percentage) : 0;
  }

  get monthlyEmi(): number {
    if (!this.total) {
      return 0;
    }
    return Math.round(this.total / 6);
  }

  clearWishlist(): void {
    this.localCartService.clear();
    this.showNotification('Wishlist cleared!', 'success');
  }

  proceedToCheckout(): void {
    this.router.navigate(['/cart']);
  }

  applyCoupon(): void {
    console.log('Applying coupon...');
    this.showNotification('Coupon applied successfully!', 'success');
  }

  getCategoryList(): string[] {
    const categories = new Set(this.wishlistItems.map(item => item.description || 'Uncategorized'));
    return Array.from(categories);
  }

  addRecommendedCourse(course: any): void {
    const id = this.buildRecommendedId(course.title);
    if (this.localCartService.hasItem(id)) {
      return;
    }
    this.localCartService.addItem({
      id,
      title: course.title,
      description: course.category,
      institute: 'TechWindows',
      mentor: 'Mentor Team',
      mode: course.duration,
      duration: course.duration,
      level: 'Skill Booster',
      price: course.price,
      originalPrice: Math.round(course.price * 1.15),
      rating: 4.6,
      reviews: 120,
      image: course.image,
      tags: ['Recommended', 'Trending'],
      addedAt: new Date().toISOString(),
    });
    this.showNotification('Course added to wishlist!', 'success');
  }

  isRecommendedAdded(course: any): boolean {
    const id = this.buildRecommendedId(course.title);
    return this.localCartService.hasItem(id);
  }

  private buildRecommendedId(title: string): string {
    return `recommended-${title.toLowerCase().replace(/\s+/g, '-')}`;
  }

  createSupportTicket(): void {
    // Reset form
    this.newTicketForm = {
      subject: '',
      category: 'Other',
      priority: 'Medium',
      description: '',
      tags: []
    };
    this.showNewTicketModal = true;
  }

  closeNewTicketModal(): void {
    this.showNewTicketModal = false;
    this.newTicketForm = {
      subject: '',
      category: 'Other',
      priority: 'Medium',
      description: '',
      tags: []
    };
  }

  submitNewTicket(): void {
    if (!this.newTicketForm.subject || !this.newTicketForm.subject.trim()) {
      this.showNotification('Please enter a subject', 'error');
      return;
    }

    if (!this.newTicketForm.description || !this.newTicketForm.description.trim()) {
      this.showNotification('Please enter a description', 'error');
      return;
    }

    this.isCreatingTicket = true;

    this.supportTicketService.createTicket(this.newTicketForm).subscribe({
      next: (ticket) => {
        this.isCreatingTicket = false;
        this.showNewTicketModal = false;
        this.showNotification('Support ticket created successfully!', 'success');
        
        // Reload tickets
        this.loadSupportTickets();
        
        // Reset form
        this.newTicketForm = {
          subject: '',
          category: 'Other',
          priority: 'Medium',
          description: '',
          tags: []
        };
      },
      error: (error) => {
        this.isCreatingTicket = false;
        const errorMessage = error.error?.message || error.message || 'Failed to create ticket';
        this.showNotification(errorMessage, 'error');
        console.error('Error creating ticket:', error);
      }
    });
  }

  viewTicketDetails(ticketId: string): void {
    this.showTicketDetailsModal = true;
    this.isLoadingTicketDetails = true;
    this.ticketDetailsError = '';
    this.selectedTicket = null;
    this.replyMessage = '';

    this.supportTicketService.getTicketById(ticketId).subscribe({
      next: (ticket) => {
        this.selectedTicket = ticket;
        this.isLoadingTicketDetails = false;
      },
      error: (error) => {
        this.isLoadingTicketDetails = false;
        this.ticketDetailsError = error.error?.message || error.message || 'Failed to load ticket details';
        console.error('Error loading ticket details:', error);
      }
    });
  }

  closeTicketDetailsModal(): void {
    this.showTicketDetailsModal = false;
    this.selectedTicket = null;
    this.replyMessage = '';
    this.ticketDetailsError = '';
  }

  formatSenderName(sender: string): string {
    if (!sender) return 'Student';
    const senderMap: { [key: string]: string } = {
      'student': 'Student',
      'support': 'Support Team',
      'admin': 'Administrator'
    };
    return senderMap[sender.toLowerCase()] || sender.charAt(0).toUpperCase() + sender.slice(1);
  }

  sendReply(): void {
    if (!this.selectedTicket || !this.replyMessage || !this.replyMessage.trim()) {
      this.showNotification('Please enter a message', 'error');
      return;
    }

    this.isSendingReply = true;

    this.supportTicketService.addMessage(this.selectedTicket.id, this.replyMessage).subscribe({
      next: (updatedTicket) => {
        this.isSendingReply = false;
        this.selectedTicket = updatedTicket;
        this.replyMessage = '';
        this.showNotification('Message sent successfully!', 'success');
      },
      error: (error) => {
        this.isSendingReply = false;
        const errorMessage = error.error?.message || error.message || 'Failed to send message';
        this.showNotification(errorMessage, 'error');
        console.error('Error sending message:', error);
      }
    });
  }

  // FAQ data
  faqCategories = [
    {
      title: 'Account & Billing',
      questions: [
        {
          question: 'How do I update my payment method?',
          answer: 'You can update your payment method in the Payment & Billing section.'
        },
        {
          question: 'How do I cancel my subscription?',
          answer: 'You can cancel your subscription from the Account Settings page.'
        }
      ]
    },
    {
      title: 'Course Access',
      questions: [
        {
          question: 'How long do I have access to my courses?',
          answer: 'You have lifetime access to all courses you purchase.'
        },
        {
          question: 'Can I download course materials?',
          answer: 'Yes, most course materials are available for download.'
        }
      ]
    }
  ];
}