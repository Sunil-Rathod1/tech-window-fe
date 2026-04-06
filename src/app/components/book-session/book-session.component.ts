import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShareDataService } from 'src/app/services/share-data.service';

interface Mentor {
  id: number;
  name: string;
  title: string;
  company: string;
  avatar: string;
  expertise: string[];
  experience: string;
  location: string;
  availability: string;
  rating: number;
  mentees: number;
  sessions: number;
  achievements: string[];
  description: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

interface TimeSlot {
  id: string;
  time: string;
  date: string;
  available: boolean;
  type: 'one-on-one' | 'group' | 'demo';
}

interface SessionType {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  maxParticipants?: number;
}

@Component({
  selector: 'app-book-session',
  templateUrl: './book-session.component.html',
  styleUrls: ['./book-session.component.css']
})
export class BookSessionComponent implements OnInit {

  mentor: Mentor = {
    id: 0,
    name: '',
    title: '',
    company: '',
    avatar: '',
    expertise: [],
    experience: '',
    location: '',
    availability: '',
    rating: 0,
    mentees: 0,
    sessions: 0,
    achievements: [],
    description: '',
    socialLinks: {}
  };
  bookingForm!: FormGroup;
  currentStep: number = 1;
  totalSteps: number = 4;
  isSubmitting: boolean = false;
  selectedTimeSlot: TimeSlot | null = null;
  selectedSessionType: SessionType | null = null;
  selectedDate: string = '';
  selectedPaymentMethod: string = '';
  couponCode: string = '';
  discountApplied: number = 0;

  // Session types
  sessionTypes: SessionType[] = [
    {
      id: 'one-on-one',
      name: 'One-on-One Session',
      duration: 60,
      price: 2500,
      description: 'Personalized 1:1 mentoring session',
      maxParticipants: 1
    },
    {
      id: 'group',
      name: 'Group Session',
      duration: 90,
      price: 1500,
      description: 'Group mentoring session (up to 5 participants)',
      maxParticipants: 5
    },
    {
      id: 'demo',
      name: 'Demo Session',
      duration: 30,
      price: 0,
      description: 'Free trial session to get started',
      maxParticipants: 1
    },
    {
      id: 'intensive',
      name: 'Intensive Session',
      duration: 120,
      price: 4000,
      description: 'Extended deep-dive session',
      maxParticipants: 1
    }
  ];

  // Available time slots (mock data)
  availableSlots: TimeSlot[] = [
    { id: '1', time: '09:00 AM', date: '2024-01-15', available: true, type: 'one-on-one' },
    { id: '2', time: '10:30 AM', date: '2024-01-15', available: true, type: 'one-on-one' },
    { id: '3', time: '02:00 PM', date: '2024-01-15', available: true, type: 'group' },
    { id: '4', time: '04:00 PM', date: '2024-01-15', available: false, type: 'one-on-one' },
    { id: '5', time: '06:00 PM', date: '2024-01-15', available: true, type: 'one-on-one' },
    { id: '6', time: '09:00 AM', date: '2024-01-16', available: true, type: 'one-on-one' },
    { id: '7', time: '11:00 AM', date: '2024-01-16', available: true, type: 'group' },
    { id: '8', time: '03:00 PM', date: '2024-01-16', available: true, type: 'one-on-one' },
    { id: '9', time: '05:30 PM', date: '2024-01-16', available: true, type: 'one-on-one' },
    { id: '10', time: '10:00 AM', date: '2024-01-17', available: true, type: 'demo' },
    { id: '11', time: '02:30 PM', date: '2024-01-17', available: true, type: 'one-on-one' },
    { id: '12', time: '07:00 PM', date: '2024-01-17', available: true, type: 'group' }
  ];

  // Payment methods
  paymentMethods = [
    { id: 'credit-card', name: 'Credit/Debit Card', icon: 'fa-credit-card' },
    { id: 'upi', name: 'UPI Payment', icon: 'fa-mobile' },
    { id: 'netbanking', name: 'Net Banking', icon: 'fa-university' },
    { id: 'wallet', name: 'Digital Wallet', icon: 'fa-wallet' },
    { id: 'credits', name: 'Prepaid Credits', icon: 'fa-coins' }
  ];

  // Communication modes
  communicationModes = [
    { id: 'online', name: 'Online Meeting', icon: 'fa-video', description: 'Zoom, Google Meet, MS Teams' },
    { id: 'offline', name: 'In-Person', icon: 'fa-map-marker', description: 'At institute location' },
    { id: 'phone', name: 'Phone Call', icon: 'fa-phone', description: 'Voice call session' }
  ];

  // Session goals
  sessionGoals = [
    'Career Guidance',
    'Technical Skills Development',
    'Interview Preparation',
    'Project Review',
    'Leadership Development',
    'Industry Insights',
    'Resume Building',
    'Networking Tips',
    'Salary Negotiation',
    'Work-Life Balance'
  ];

  // Languages
  languages = [
    'English',
    'Hindi',
    'Tamil',
    'Telugu',
    'Kannada',
    'Malayalam',
    'Bengali',
    'Gujarati'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private shareDataService: ShareDataService
  ) {}

  ngOnInit(): void {
    // Get mentor data from ShareDataService
    const mentorData = this.shareDataService.getOption() as any;
    
    // Initialize mentor with data from service or use default values
    if (mentorData && mentorData.name) {
      this.mentor = {
        id: mentorData.id || 0,
        name: mentorData.name || '',
        title: mentorData.title || '',
        company: mentorData.company || '',
        avatar: mentorData.avatar || '',
        expertise: mentorData.expertise || [],
        experience: mentorData.experience || '',
        location: mentorData.location || '',
        availability: mentorData.availability || '',
        rating: mentorData.rating || 0,
        mentees: mentorData.mentees || 0,
        sessions: mentorData.sessions || 0,
        achievements: mentorData.achievements || [],
        description: mentorData.description || '',
        socialLinks: mentorData.socialLinks || {}
      };
    }
    
    // Initialize booking form
    this.initializeForm();
    
    // Set default date to today
    this.selectedDate = new Date().toISOString().split('T')[0];
  }

  initializeForm(): void {
    this.bookingForm = this.fb.group({
      // Step 1: Session Details
      sessionType: ['', Validators.required],
      duration: ['', Validators.required],
      communicationMode: ['online', Validators.required],
      
      // Step 2: Scheduling
      selectedDate: ['', Validators.required],
      selectedTimeSlot: ['', Validators.required],
      
      // Step 3: Preferences
      sessionGoals: [[], Validators.required],
      preferredLanguage: ['English', Validators.required],
      specialRequirements: [''],
      notes: [''],
      
      // Step 4: Payment
      paymentMethod: ['', Validators.required],
      couponCode: [''],
      agreeToTerms: [false, Validators.requiredTrue],
      agreeToPrivacy: [false, Validators.requiredTrue]
    });
  }

  // Navigation methods
  nextStep(): void {
    if (this.isCurrentStepValid()) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    this.currentStep--;
  }

  goToStep(step: number): void {
    if (step <= this.currentStep || this.isStepCompleted(step - 1)) {
      this.currentStep = step;
    }
  }

  // Validation methods
  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!(this.bookingForm.get('sessionType')?.valid && 
                 this.bookingForm.get('communicationMode')?.valid);
      case 2:
        return !!(this.bookingForm.get('selectedDate')?.valid && 
                 this.bookingForm.get('selectedTimeSlot')?.valid);
      case 3:
        return !!(this.bookingForm.get('sessionGoals')?.valid && 
                 this.bookingForm.get('preferredLanguage')?.valid);
      case 4:
        return !!(this.bookingForm.get('paymentMethod')?.valid && 
                 this.bookingForm.get('agreeToTerms')?.valid && 
                 this.bookingForm.get('agreeToPrivacy')?.valid);
      default:
        return false;
    }
  }

  isStepCompleted(step: number): boolean {
    switch (step) {
      case 1:
        return !!(this.bookingForm.get('sessionType')?.valid && 
                 this.bookingForm.get('communicationMode')?.valid);
      case 2:
        return !!(this.bookingForm.get('selectedDate')?.valid && 
                 this.bookingForm.get('selectedTimeSlot')?.valid);
      case 3:
        return !!(this.bookingForm.get('sessionGoals')?.valid && 
                 this.bookingForm.get('preferredLanguage')?.valid);
      case 4:
        return !!(this.bookingForm.get('paymentMethod')?.valid && 
                 this.bookingForm.get('agreeToTerms')?.valid && 
                 this.bookingForm.get('agreeToPrivacy')?.valid);
      default:
        return false;
    }
  }

  // Session type selection
  selectSessionType(sessionType: SessionType): void {
    this.selectedSessionType = sessionType;
    this.bookingForm.patchValue({
      sessionType: sessionType.id,
      duration: sessionType.duration
    });
  }

  // Time slot selection
  selectTimeSlot(slot: TimeSlot): void {
    if (slot.available) {
      this.selectedTimeSlot = slot;
      this.bookingForm.patchValue({
        selectedTimeSlot: slot.id
      });
    }
  }

  // Date selection
  onDateChange(): void {
    this.bookingForm.patchValue({
      selectedDate: this.selectedDate
    });
  }

  // Session goals selection
  onGoalChange(goal: string, event: any): void {
    const goals = this.bookingForm.get('sessionGoals')?.value || [];
    if (event.target.checked) {
      goals.push(goal);
    } else {
      const index = goals.indexOf(goal);
      if (index > -1) {
        goals.splice(index, 1);
      }
    }
    this.bookingForm.patchValue({ sessionGoals: goals });
  }

  // Payment method selection
  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
    this.bookingForm.patchValue({ paymentMethod: method });
  }

  // Coupon code application
  applyCouponCode(): void {
    const couponCode = this.couponCode.toUpperCase();
    // Mock coupon validation
    const validCoupons: { [key: string]: number } = {
      'WELCOME20': 20,
      'STUDENT15': 15,
      'FIRST10': 10,
      'MENTOR25': 25
    };

    if (validCoupons[couponCode]) {
      this.discountApplied = validCoupons[couponCode];
      alert(`Coupon applied! You get ${this.discountApplied}% discount.`);
    } else {
      alert('Invalid coupon code. Please try again.');
    }
  }

  // Calculate total price
  getTotalPrice(): number {
    if (!this.selectedSessionType) return 0;
    const basePrice = this.selectedSessionType.price;
    const discount = (basePrice * this.discountApplied) / 100;
    return basePrice - discount;
  }

  // Form submission
  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.isSubmitting = true;
      
      // Simulate booking process
      setTimeout(() => {
        console.log('Booking submitted:', this.bookingForm.value);
        alert('Session booked successfully! You will receive a confirmation email shortly.');
        this.router.navigate(['/Mentors']);
        this.isSubmitting = false;
      }, 2000);
    }
  }

  // Utility methods
  goBack(): void {
    this.router.navigate(['/Mentors']);
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN')}`;
  }

  getRatingStars(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  // Get available slots for selected date
  getAvailableSlotsForDate(): TimeSlot[] {
    return this.availableSlots.filter(slot => 
      slot.date === this.selectedDate && slot.available
    );
  }

  // Get filtered slots by session type
  getFilteredSlots(): TimeSlot[] {
    const slots = this.getAvailableSlotsForDate();
    if (this.selectedSessionType) {
      return slots.filter(slot => slot.type === this.selectedSessionType!.id);
    }
    return slots;
  }
}
