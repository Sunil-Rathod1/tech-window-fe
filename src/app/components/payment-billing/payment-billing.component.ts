import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalCartService, LocalCartItem } from 'src/app/services/local-cart.service';
import { StudentService } from 'src/app/services/student.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-payment-billing',
  templateUrl: './payment-billing.component.html',
  styleUrls: ['./payment-billing.component.css']
})
export class PaymentBillingComponent implements OnInit {
  
  // User account details
  public userEmail: string = 'bharath.patnana143@gmail.com';
  public isAccountVerified: boolean = true;
  
  // Billing address
  public selectedCountry: string = 'India';
  public selectedState: string = '';
  public countries: any[] = [
    { name: 'India', code: 'IN', flag: '🇮🇳' },
    { name: 'United States', code: 'US', flag: '🇺🇸' },
    { name: 'United Kingdom', code: 'UK', flag: '🇬🇧' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦' },
    { name: 'Australia', code: 'AU', flag: '🇦🇺' }
  ];
  
  public states: any[] = [
    { name: 'Andhra Pradesh', code: 'AP' },
    { name: 'Karnataka', code: 'KA' },
    { name: 'Tamil Nadu', code: 'TN' },
    { name: 'Maharashtra', code: 'MH' },
    { name: 'Delhi', code: 'DL' },
    { name: 'Gujarat', code: 'GJ' },
    { name: 'Rajasthan', code: 'RJ' },
    { name: 'Uttar Pradesh', code: 'UP' }
  ];
  
  // Payment methods
  public selectedPaymentMethod: string = 'cards';
  public selectedUpiMethod: string = 'qr';
  public cardDetails = {
    holderName: '',
    number: '',
    expiry: '',
    cvv: ''
  };
  public upiId: string = '';
  public cashDetails = {
    paymentLocation: '',
    contactPersonName: '',
    contactPhone: '',
    preferredDate: '',
    preferredTime: '',
    additionalNotes: ''
  };
  public paymentStatus: 'idle' | 'processing' | 'success' = 'idle';
  public qrGenerated: boolean = false;
  
  // Order summary
  public orderSummary: any = {
    originalPrice: 3459,
    discount: 2920,
    discountPercentage: 84,
    total: 539,
    courseCount: 1,
    courseName: 'Complete Selenium Automation Testing Course'
  };
  
  // Recent enrollments
  public recentEnrollments: number = 30;
  
  // Cart items
  public cartItems: LocalCartItem[] = [];
  public isEnrolling: boolean = false;

  constructor(
    private router: Router,
    private localCartService: LocalCartService,
    private studentService: StudentService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    // Get cart items
    this.localCartService.items$.subscribe(items => {
      this.cartItems = items;
    });
  }
  
  onCountryChange(country: string): void {
    this.selectedCountry = country;
    this.selectedState = ''; // Reset state when country changes
  }
  
  onStateChange(state: string): void {
    this.selectedState = state;
  }
  
  onPaymentMethodChange(method: string): void {
    this.selectedPaymentMethod = method;
    this.paymentStatus = 'idle';
  }
  
  onUpiMethodChange(method: string): void {
    this.selectedUpiMethod = method;
    this.paymentStatus = 'idle';
    this.qrGenerated = false;
  }
  
  proceedToPayment(): void {
    // Removed validations - proceed directly to payment processing
    this.paymentStatus = 'processing';
    
    // Process payment and enroll courses
    this.processPaymentAndEnroll();
  }
  
  private processPaymentAndEnroll(): void {
    // Simulate payment processing
    setTimeout(() => {
      this.paymentStatus = 'success';
      
      // Enroll courses after successful payment
      this.enrollCourses();
    }, 1500);
  }
  
  private enrollCourses(): void {
    if (this.cartItems.length === 0) {
      console.warn('No courses in cart to enroll');
      this.router.navigate(['/Account']);
      return;
    }

    // Check if user is authenticated
    const token = this.authService.getToken();
    if (!token) {
      alert('Please login to complete enrollment');
      this.router.navigate(['/Account']);
      return;
    }

    this.isEnrolling = true;

    // Map cart items to enrollment format
    const isValidObjectId = (value?: string | null): boolean => {
      if (!value) return false;
      return /^[a-fA-F0-9]{24}$/.test(value);
    };

    const courses = this.cartItems.map(item => {
      // Determine course type from cart item
      let courseType: 'trainer' | 'institution' | 'mentor' = 'trainer';
      if (item.institute && item.institute.toLowerCase() !== 'techwindows') {
        courseType = 'institution';
      } else if (item.mentor && !item.institute) {
        courseType = 'mentor';
      }

      // Use backend IDs when available; avoid slug/cart IDs
      const courseId = isValidObjectId(item.courseId) ? item.courseId : null;
      const instructorId = isValidObjectId(item.trainerId || item.instructorId) ? (item.trainerId || item.instructorId) : null;
      const institutionCourseId = courseType === 'institution' && isValidObjectId(item.courseId) ? item.courseId : null;

      return {
        courseId: courseId,
        institutionCourseId: institutionCourseId,
        courseType,
        courseTitle: item.title,
        courseCategory: item.description || '',
        courseLevel: item.level || 'Beginner',
        instructorName: item.mentor || '',
        instructorId: instructorId, // Use trainerId from cart item
        institutionName: item.institute || '',
        institutionId: null,
        amountPaid: item.price,
        paymentMethod: this.mapPaymentMethod(this.selectedPaymentMethod),
        paymentStatus: 'paid',
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
    });

    const paymentDetails = {
      paymentMethod: this.mapPaymentMethod(this.selectedPaymentMethod),
      amount: this.cartItems.reduce((sum, item) => sum + item.price, 0),
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      paymentDate: new Date().toISOString()
    };

    this.studentService.createEnrollments(courses, paymentDetails).subscribe({
      next: (response) => {
        this.isEnrolling = false;
        console.log('Courses enrolled successfully:', response);
        
        // Clear cart after successful enrollment
        this.localCartService.clear();
        
        // Redirect to account dashboard
        setTimeout(() => {
          this.redirectAfterEnrollment();
        }, 1200);
      },
      error: (error) => {
        this.isEnrolling = false;
        console.error('Error enrolling courses:', error);
        alert('Payment successful but enrollment failed. Please contact support.');
        // Still redirect to account
        this.redirectAfterEnrollment();
      }
    });
  }
  
  private mapPaymentMethod(method: string): string {
    const mapping: { [key: string]: string } = {
      'cards': 'credit_card',
      'upi': 'upi',
      'cash': 'cash',
      'netbanking': 'net_banking',
      'wallet': 'wallet'
    };
    return mapping[method] || 'upi';
  }

  private redirectAfterEnrollment(): void {
    const currentUser = this.authService.getCurrentUserValue();
    const hasCompletedEnrollment = !!currentUser?.enrollmentCompleted;
    const redirectRoute = hasCompletedEnrollment ? '/Account' : '/student-enrollment';
    this.router.navigate([redirectRoute]);
  }

  generateQr(): void {
    this.qrGenerated = true;
    this.paymentStatus = 'idle';
  }

  isCardDetailsValid(): boolean {
    return (
      this.cardDetails.holderName.trim().length > 2 &&
      this.cardDetails.number.replace(/\s+/g, '').length === 16 &&
      this.cardDetails.expiry.trim().length >= 4 &&
      this.cardDetails.cvv.trim().length === 3
    );
  }

  handleExpiryInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    input.value = value;
    this.cardDetails.expiry = value;
  }

  handleCvvInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '').slice(0, 3);
    input.value = value;
    this.cardDetails.cvv = value;
  }

  isCashDetailsValid(): boolean {
    return (
      this.cashDetails.paymentLocation.trim().length >= 5 &&
      this.cashDetails.contactPersonName.trim().length >= 2 &&
      this.cashDetails.contactPhone.trim().length >= 10 &&
      this.cashDetails.preferredDate.trim().length > 0 &&
      this.cashDetails.preferredTime.trim().length > 0
    );
  }

  isPayButtonDisabled(): boolean {
    const cardInvalid =
      this.selectedPaymentMethod === 'cards' && !this.isCardDetailsValid();
    const upiIdMissing =
      this.selectedPaymentMethod === 'upi' &&
      this.selectedUpiMethod === 'id' &&
      !this.upiId.trim();
    const cashInvalid =
      this.selectedPaymentMethod === 'cash' && !this.isCashDetailsValid();
    return cardInvalid || upiIdMissing || cashInvalid;
  }
  
  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN')}`;
  }

  getMinDate(): string {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Minimum date is tomorrow
    return today.toISOString().split('T')[0];
  }

  handlePhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    input.value = value;
    this.cashDetails.contactPhone = value;
  }
}
