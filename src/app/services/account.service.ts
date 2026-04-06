import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { StudentService } from './student.service';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  subscription: string;
  lastLogin: string;
  status: string;
}

export interface AccountStats {
  totalOrders: number;
  completedCourses: number;
  activeSubscriptions: number;
  totalSpent: number;
  loyaltyPoints: number;
  certificatesEarned: number;
  coursesInProgress?: number;
  averageRating?: number;
  totalLearningHours?: number;
  streakDays?: number;
}

export interface Order {
  id: string;
  orderNumber?: string;
  courseName: string;
  amount: number;
  status: string;
  date: string;
  paymentMethod: string;
  invoice: string;
  // Enrollment details
  enrollment?: {
    id: string;
    courseType: string;
    courseLevel: string;
    instructorName: string;
    institutionName: string;
    progress: number;
    enrollmentStatus: string;
    enrollmentDate: string;
    transactionId: string;
  };
  // Additional payment details
  paymentDetails?: {
    transactionId: string;
    paymentStatus: string;
    paymentDate: string;
  };
}

export interface PaymentDetails {
  id: string;
  orderNumber: string;
  studentId: string;
  courseId: string;
  courseName: string;
  amount: number;
  discount: number;
  tax: number;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet' | 'cash' | 'paypal' | 'stripe';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  paymentDetails: {
    transactionId?: string;
    paymentGateway?: string;
    cardLast4?: string;
    cardBrand?: string;
    upiId?: string;
    bankName?: string;
    paymentDate?: string;
    paymentReference?: string;
  };
  invoiceNumber?: string;
  invoiceUrl?: string;
  billingAddress: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  notes?: string;
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;
  orderHistory?: Array<{
    date: string;
    status: string;
    description: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface TrainerDetails {
  id?: string;
  name: string;
  avatar?: string;
  designation?: string;
  title?: string;
  specialization?: string;
  experience?: string;
  education?: string;
  location?: string;
  languagesKnown?: string[];
  expertiseSkills?: string[];
  achievements?: string[];
  bio?: string;
  rating?: number;
}

export interface CourseDetails {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  category?: string;
  level?: string;
  price?: number;
  thumbnail?: string;
  rating?: number;
  totalEnrollments?: number;
  duration?: string;
  hours?: number;
  curriculum?: any[];
  overview?: any[];
}

export interface LearningProgress {
  id: string;
  courseName: string;
  progress: number;
  instructor: string;
  nextSession: string;
  completedModules: number;
  totalModules: number;
  startDate?: string;
  endDate?: string;
  certificate?: string;
  grade?: string;
  attendance?: {
    attendancePercentage: number;
    attendedSessions: number;
    totalSessions: number;
  };
  // Enhanced fields
  courseType?: string;
  courseCategory?: string;
  courseLevel?: string;
  instructorId?: string;
  institutionName?: string;
  institutionId?: string;
  amountPaid?: number;
  paymentMethod?: string;
  transactionId?: string;
  enrollmentDate?: string;
  status?: 'active' | 'completed' | 'cancelled' | 'paused';
  trainerDetails?: TrainerDetails;
  courseDetails?: CourseDetails;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  date: string;
  isRead: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
  points: number;
}

export interface AccountOverview {
  userProfile: UserProfile;
  accountStats: AccountStats;
  recentOrders: Order[];
  learningProgress: LearningProgress[];
  notifications: Notification[];
  achievements: Achievement[];
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(
    private apiService: ApiService,
    private studentService: StudentService
  ) { }

  // Get complete account overview
  getAccountOverview(): Observable<AccountOverview> {
    // Mock data since API endpoint doesn't exist
    const mockData: AccountOverview = {
      userProfile: {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@techwindows.com',
        phone: '+91 98765 43210',
        avatar: 'assets/photos/user-avatar.jpg',
        memberSince: '2024-01-15',
        subscription: 'Premium',
        lastLogin: '2024-11-25T10:30:00Z',
        status: 'Active'
      },
      accountStats: {
        totalOrders: 15,
        completedCourses: 8,
        activeSubscriptions: 2,
        totalSpent: 45000,
        loyaltyPoints: 1250,
        certificatesEarned: 6,
        coursesInProgress: 4,
        averageRating: 4.8,
        totalLearningHours: 156,
        streakDays: 12
      },
      recentOrders: [
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
        }
      ],
      learningProgress: [
        {
          id: '1',
          courseName: 'Advanced React Development',
          progress: 100,
          instructor: 'Sarah Johnson',
          nextSession: '2024-12-01T10:00:00Z',
          completedModules: 12,
          totalModules: 12,
          startDate: '2024-10-01',
          endDate: '2024-11-15'
        },
        {
          id: '2',
          courseName: 'Machine Learning Basics',
          progress: 65,
          instructor: 'Dr. Michael Chen',
          nextSession: '2024-12-05T14:00:00Z',
          completedModules: 8,
          totalModules: 12,
          startDate: '2024-11-01',
          endDate: '2024-12-15'
        }
      ],
      notifications: [
        {
          id: '1',
          title: 'Course Completed',
          message: 'You have successfully completed the React Advanced Course!',
          type: 'success',
          date: '2024-11-25T14:30:00Z',
          isRead: false
        },
        {
          id: '2',
          title: 'New Certificate',
          message: 'Your JavaScript Certificate is ready for download.',
          type: 'info',
          date: '2024-11-24T16:45:00Z',
          isRead: false
        }
      ],
      achievements: [
        {
          id: '1',
          title: 'First Course Completed',
          description: 'Completed your first course on the platform',
          icon: 'fas fa-graduation-cap',
          date: '2024-10-15T10:00:00Z',
          points: 100
        },
        {
          id: '2',
          title: 'Learning Streak',
          description: 'Maintained a 7-day learning streak',
          icon: 'fas fa-fire',
          date: '2024-11-20T08:00:00Z',
          points: 200
        }
      ]
    };
    return of(mockData);
  }

  // Get account statistics only
  getAccountStats(): Observable<AccountStats> {
    // Mock data since API endpoint doesn't exist
    const mockData: AccountStats = {
      totalOrders: 15,
      completedCourses: 8,
      activeSubscriptions: 2,
      totalSpent: 45000,
      loyaltyPoints: 1250,
      certificatesEarned: 6,
      coursesInProgress: 4,
      averageRating: 4.8,
      totalLearningHours: 156,
      streakDays: 12
    };
    return of(mockData);
  }

  // Update user profile
  updateUserProfile(profileData: Partial<UserProfile>): Observable<UserProfile> {
    // Mock implementation - in real app, this would call API
    console.log('Updating user profile:', profileData);
    const mockData: UserProfile = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@techwindows.com',
      phone: '+91 98765 43210',
      avatar: 'assets/photos/user-avatar.jpg',
      memberSince: '2024-01-15',
      subscription: 'Premium',
      lastLogin: '2024-11-25T10:30:00Z',
      status: 'Active'
    };
    return of(mockData);
  }

  // Get user profile only
  getUserProfile(): Observable<UserProfile> {
    // Mock data since API endpoint doesn't exist
    const mockData: UserProfile = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@techwindows.com',
      phone: '+91 98765 43210',
      avatar: 'assets/photos/user-avatar.jpg',
      memberSince: '2024-01-15',
      subscription: 'Premium',
      lastLogin: '2024-11-25T10:30:00Z',
      status: 'Active'
    };
    return of(mockData);
  }

  // Get recent orders from enrollments (enrolled courses with payment details)
  getRecentOrders(limit: number = 10): Observable<Order[]> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No authentication token found. User may not be logged in.');
      return of([]);
    }
    
    // Fetch enrollments which contain payment details
    return this.studentService.getEnrollments().pipe(
      map((enrollments: any[]) => {
        console.log(`Received ${enrollments.length} enrollments for payment history`);
        
        // Transform enrollments to Order format for display
        const orders: Order[] = enrollments
          .filter(enrollment => enrollment.amountPaid > 0) // Only show paid enrollments
          .map((enrollment: any) => {
            // Generate a display ID from enrollment ID
            const displayId = enrollment.id || enrollment.enrollmentId || '';
            
            // Format payment method for display
            const paymentMethod = this.formatPaymentMethodForDisplay(enrollment.paymentMethod || 'upi');
            
            // Map enrollment status to order status
            const orderStatus = this.mapEnrollmentStatusToOrderStatus(enrollment.status || 'active');
            
            return {
              id: displayId,
              orderNumber: enrollment.transactionId || `ENR-${displayId.substring(0, 8)}`,
              courseName: enrollment.courseName || 'Unknown Course',
              amount: enrollment.amountPaid || 0,
              status: orderStatus,
              date: enrollment.enrollmentDate || enrollment.createdAt || new Date().toISOString(),
              paymentMethod: paymentMethod,
              invoice: enrollment.transactionId ? `INV-${enrollment.transactionId.substring(0, 8)}` : '',
              // Enrollment details
              enrollment: {
                id: displayId,
                courseType: enrollment.courseType || 'trainer',
                courseLevel: enrollment.courseLevel || 'Beginner',
                instructorName: enrollment.instructor || enrollment.instructorName || '',
                institutionName: enrollment.institutionName || '',
                progress: enrollment.progress || 0,
                enrollmentStatus: enrollment.status || 'active',
                enrollmentDate: enrollment.enrollmentDate || enrollment.createdAt || new Date().toISOString(),
                transactionId: enrollment.transactionId || ''
              },
              // Payment details
              paymentDetails: {
                transactionId: enrollment.transactionId || '',
                paymentStatus: enrollment.paymentStatus || 'paid',
                paymentDate: enrollment.enrollmentDate || enrollment.createdAt || new Date().toISOString()
              }
            };
          })
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
        
        console.log(`Returning ${orders.length} orders from enrollments`);
        return orders;
      }),
      catchError((error) => {
        console.error('Error fetching enrollment payment details:', error);
        return of([]);
      })
    );
  }
  
  // Map enrollment status to order status
  private mapEnrollmentStatusToOrderStatus(enrollmentStatus: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Completed',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'paused': 'In Progress'
    };
    return statusMap[enrollmentStatus.toLowerCase()] || 'Completed';
  }
  
  // Format payment method for display
  private formatPaymentMethodForDisplay(method: string): string {
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

  // Get payment/order details by ID
  getPaymentDetails(orderId: string): Observable<PaymentDetails> {
    return this.apiService.getAuth<PaymentDetails>(`/orders/${orderId}`).pipe(
      map((response: ApiResponse<PaymentDetails>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load payment details');
        }
        return response.data;
      })
    );
  }

  // Get learning progress from enrollments API
  getLearningProgress(): Observable<LearningProgress[]> {
    return this.studentService.getEnrollments('active').pipe(
      map((enrollments: any[]) => {
        console.log('📚 Enrollments received:', enrollments);
        // Transform enrollments to LearningProgress format
        return enrollments.map(enrollment => {
          console.log('📖 Processing enrollment:', enrollment);
          
          // Extract trainer details from enrollment - handle both populated and non-populated cases
          const instructorData = enrollment.instructorId || (typeof enrollment.instructorId === 'object' ? enrollment.instructorId : null);
          const trainerDetails: TrainerDetails | undefined = instructorData ? {
            id: instructorData._id || instructorData.id || enrollment.instructorId || '',
            name: instructorData.name || enrollment.instructor || enrollment.instructorName || 'Unknown Instructor',
            avatar: instructorData.avatar || instructorData.profilePhoto || '',
            designation: instructorData.title || instructorData.designation || '',
            title: instructorData.title || '',
            specialization: instructorData.specialization || instructorData.expertise || '',
            experience: instructorData.experience || instructorData.experienceYears ? `${instructorData.experienceYears} years` : '',
            education: instructorData.education || instructorData.qualification || '',
            location: instructorData.location || instructorData.city || '',
            languagesKnown: instructorData.languagesKnown || instructorData.languages || [],
            expertiseSkills: instructorData.expertiseSkills || instructorData.skills || (instructorData.skills ? instructorData.skills.map((s: any) => s.name || s) : []),
            achievements: instructorData.achievements || [],
            bio: instructorData.bio || instructorData.about || '',
            rating: instructorData.rating?.overall || instructorData.rating || instructorData.averageRating || 0
          } : (enrollment.instructor || enrollment.instructorName ? {
            name: enrollment.instructor || enrollment.instructorName,
            avatar: '',
            designation: '',
            specialization: '',
            experience: '',
            education: '',
            location: '',
            languagesKnown: [],
            expertiseSkills: [],
            achievements: [],
            bio: '',
            rating: 0
          } : undefined);
          
          console.log('👨‍🏫 Trainer details extracted:', trainerDetails);

          // Extract course details from enrollment - handle both populated and non-populated cases
          const course = enrollment.courseId || enrollment.institutionCourseId;
          const courseDetails: CourseDetails | undefined = course ? {
            id: course._id || course.id || enrollment.courseId || '',
            title: course.title || enrollment.courseName || 'Unknown Course',
            subtitle: course.subtitle || course.subTitle || '',
            description: course.description || course.desc || '',
            category: course.category || enrollment.courseCategory || '',
            level: course.level || enrollment.courseLevel || 'Beginner',
            price: course.price || enrollment.amountPaid || 0,
            thumbnail: course.thumbnail || course.image || '',
            rating: course.rating?.overall || course.rating || course.averageRating || 0,
            totalEnrollments: course.totalEnrollments || course.students?.total || course.enrollments || 0,
            duration: course.duration || course.courseDuration || '',
            hours: course.hours || course.durationHours || course.totalHours || 0,
            curriculum: course.curriculum || course.courseCurriculum || course.modules || [],
            overview: course.overview || course.courseOverview || []
          } : (enrollment.courseName ? {
            id: enrollment.courseId || '',
            title: enrollment.courseName,
            subtitle: '',
            description: enrollment.courseDescription || '',
            category: enrollment.courseCategory || '',
            level: enrollment.courseLevel || 'Beginner',
            price: enrollment.amountPaid || 0,
            thumbnail: '',
            rating: 0,
            totalEnrollments: 0,
            duration: '',
            hours: 0,
            curriculum: [],
            overview: []
          } : undefined);
          
          console.log('📚 Course details extracted:', courseDetails);

          const result = {
            id: enrollment.id || enrollment.enrollmentId || enrollment._id?.toString() || '',
            courseName: enrollment.courseName || course?.title || 'Unknown Course',
            progress: enrollment.progress || 0,
            instructor: enrollment.instructor || enrollment.instructorName || trainerDetails?.name || 'Unknown Instructor',
            nextSession: enrollment.nextSession || null,
            completedModules: enrollment.completedModules || 0,
            totalModules: enrollment.totalModules || 0,
            startDate: enrollment.startDate || enrollment.enrollmentDate,
            endDate: enrollment.endDate || null,
            certificate: enrollment.certificate || enrollment.certificateUrl || null,
            grade: enrollment.grade || null,
            attendance: enrollment.attendance || {
              attendancePercentage: 0,
              attendedSessions: 0,
              totalSessions: 0
            },
            // Enhanced fields
            courseType: enrollment.courseType || 'trainer',
            courseCategory: enrollment.courseCategory || course?.category || '',
            courseLevel: enrollment.courseLevel || course?.level || 'Beginner',
            instructorId: instructorData?._id || instructorData?.id || enrollment.instructorId || null,
            institutionName: enrollment.institutionName || enrollment.institutionId?.name || '',
            institutionId: enrollment.institutionId?._id || enrollment.institutionId?.id || enrollment.institutionId || null,
            amountPaid: enrollment.amountPaid || 0,
            paymentMethod: enrollment.paymentMethod || '',
            transactionId: enrollment.transactionId || '',
            enrollmentDate: enrollment.enrollmentDate || enrollment.createdAt || new Date().toISOString(),
            status: enrollment.status || 'active',
            trainerDetails: trainerDetails,
            courseDetails: courseDetails
          };
          
          console.log('✅ Final LearningProgress object:', result);
          return result;
        });
      }),
      catchError((error) => {
        console.error('Error fetching learning progress:', error);
        // Return empty array on error
        return of([]);
      })
    );
  }

  // Get notifications
  getNotifications(): Observable<Notification[]> {
    // Mock data since API endpoint doesn't exist
    const mockData: Notification[] = [
      {
        id: '1',
        title: 'Course Completed',
        message: 'You have successfully completed the React Advanced Course!',
        type: 'success',
        date: '2024-11-25T14:30:00Z',
        isRead: false
      },
      {
        id: '2',
        title: 'New Certificate',
        message: 'Your JavaScript Certificate is ready for download.',
        type: 'info',
        date: '2024-11-24T16:45:00Z',
        isRead: false
      },
      {
        id: '3',
        title: 'Upcoming Session',
        message: 'Your next Node.js session is scheduled for tomorrow at 4:00 PM.',
        type: 'warning',
        date: '2024-11-23T09:15:00Z',
        isRead: true
      }
    ];
    return of(mockData);
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: string): Observable<boolean> {
    // Mock implementation
    console.log('Marking notification as read:', notificationId);
    return of(true);
  }

  // Get achievements
  getAchievements(): Observable<Achievement[]> {
    // Mock data since API endpoint doesn't exist
    const mockData: Achievement[] = [
      {
        id: '1',
        title: 'First Course Completed',
        description: 'Completed your first course on the platform',
        icon: 'fas fa-graduation-cap',
        date: '2024-10-15T10:00:00Z',
        points: 100
      },
      {
        id: '2',
        title: 'Learning Streak',
        description: 'Maintained a 7-day learning streak',
        icon: 'fas fa-fire',
        date: '2024-11-20T08:00:00Z',
        points: 200
      },
      {
        id: '3',
        title: 'Certificate Collector',
        description: 'Earned 5 certificates',
        icon: 'fas fa-certificate',
        date: '2024-11-24T16:45:00Z',
        points: 500
      }
    ];
    return of(mockData);
  }
}
