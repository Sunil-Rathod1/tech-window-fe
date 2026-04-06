import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mentor-dashboard',
  templateUrl: './mentor-dashboard.component.html',
  styleUrls: ['./mentor-dashboard.component.css']
})
export class MentorDashboardComponent implements OnInit {
  
  // Dashboard state
  activeSection = 'overview';
  sidebarCollapsed = false;
  
  // Mentor stats
  mentorStats = {
    totalMentees: 89,
    activeMentorships: 12,
    completedSessions: 156,
    rating: 4.9,
    earnings: 18750,
    upcomingSessions: 8,
    mentorshipHours: 320
  };
  
  // Recent activities
  recentActivities = [
    {
      type: 'mentorship',
      title: 'Completed Career Guidance Session',
      time: '1 hour ago',
      mentees: 1,
      icon: 'fas fa-user-graduate'
    },
    {
      type: 'session',
      title: 'New Mentorship Program Started',
      time: '3 hours ago',
      mentees: 5,
      icon: 'fas fa-handshake'
    },
    {
      type: 'mentee',
      title: 'New Mentee Joined',
      time: '1 day ago',
      mentees: 1,
      icon: 'fas fa-user-plus'
    },
    {
      type: 'achievement',
      title: 'Mentee Got Job Offer',
      time: '2 days ago',
      mentees: 1,
      icon: 'fas fa-trophy'
    },
    {
      type: 'review',
      title: 'Received 5-star Review',
      time: '3 days ago',
      mentees: 0,
      icon: 'fas fa-star'
    }
  ];
  
  // Upcoming mentorship sessions
  upcomingSessions = [
    {
      id: 1,
      mentee: 'Sarah Johnson',
      topic: 'Career Transition',
      date: '2024-01-15',
      time: '2:00 PM',
      duration: '1 hour',
      status: 'confirmed',
      type: 'one-on-one'
    },
    {
      id: 2,
      mentee: 'Mike Chen',
      topic: 'Technical Skills Development',
      date: '2024-01-16',
      time: '10:00 AM',
      duration: '1.5 hours',
      status: 'pending',
      type: 'group'
    },
    {
      id: 3,
      mentee: 'Emily Davis',
      topic: 'Leadership Skills',
      date: '2024-01-17',
      time: '3:00 PM',
      duration: '1 hour',
      status: 'confirmed',
      type: 'one-on-one'
    },
    {
      id: 4,
      mentee: 'Alex Rodriguez',
      topic: 'Industry Insights',
      date: '2024-01-18',
      time: '11:00 AM',
      duration: '2 hours',
      status: 'confirmed',
      type: 'workshop'
    }
  ];
  
  // Mentorship programs
  mentorshipPrograms = [
    {
      name: 'Career Transition Program',
      mentees: 15,
      completed: 12,
      rating: 4.8,
      revenue: 4500,
      duration: '3 months',
      status: 'active'
    },
    {
      name: 'Technical Skills Bootcamp',
      mentees: 22,
      completed: 18,
      rating: 4.9,
      revenue: 6600,
      duration: '6 months',
      status: 'active'
    },
    {
      name: 'Leadership Development',
      mentees: 8,
      completed: 6,
      rating: 4.7,
      revenue: 2400,
      duration: '4 months',
      status: 'completed'
    },
    {
      name: 'Industry Networking',
      mentees: 35,
      completed: 30,
      rating: 4.6,
      revenue: 5250,
      duration: '2 months',
      status: 'active'
    }
  ];
  
  // Mentee progress data
  menteeProgress = [
    {
      name: 'Sarah Johnson',
      program: 'Career Transition',
      progress: 85,
      sessions: 8,
      nextSession: '2024-01-15',
      status: 'on-track'
    },
    {
      name: 'Mike Chen',
      program: 'Technical Skills',
      progress: 60,
      sessions: 12,
      nextSession: '2024-01-16',
      status: 'on-track'
    },
    {
      name: 'Emily Davis',
      program: 'Leadership',
      progress: 40,
      sessions: 4,
      nextSession: '2024-01-17',
      status: 'needs-attention'
    },
    {
      name: 'Alex Rodriguez',
      program: 'Industry Insights',
      progress: 95,
      sessions: 9,
      nextSession: '2024-01-18',
      status: 'excellent'
    }
  ];

  // Earnings & Payments data
  earningsData = {
    totalEarnings: 280000,
    monthlyEarnings: 45000,
    yearlyEarnings: 280000,
    pendingPayments: 8000,
    paidAmount: 272000,
    thisMonthGrowth: 12.5,
    lastMonthGrowth: 8.3
  };

  earningsChart = [
    { month: 'Jan', amount: 35000 },
    { month: 'Feb', amount: 42000 },
    { month: 'Mar', amount: 38000 },
    { month: 'Apr', amount: 45000 },
    { month: 'May', amount: 48000 },
    { month: 'Jun', amount: 45000 },
    { month: 'Jul', amount: 52000 },
    { month: 'Aug', amount: 49000 },
    { month: 'Sep', amount: 45000 },
    { month: 'Oct', amount: 48000 },
    { month: 'Nov', amount: 46000 },
    { month: 'Dec', amount: 45000 }
  ];

  recentTransactions = [
    {
      id: '1',
      type: 'session_payment',
      amount: 5000,
      description: 'Career Guidance session with Alex Kumar',
      date: '2024-03-18',
      status: 'completed',
      transactionId: 'TXN789012345',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: '2',
      type: 'session_payment',
      amount: 4000,
      description: 'Technical Mentoring session with Priya Sharma',
      date: '2024-03-15',
      status: 'completed',
      transactionId: 'TXN789012346',
      paymentMethod: 'UPI'
    },
    {
      id: '3',
      type: 'session_payment',
      amount: 6000,
      description: 'Leadership Development session with Rahul Singh',
      date: '2024-02-28',
      status: 'pending',
      transactionId: 'TXN789012347',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: '4',
      type: 'program_payment',
      amount: 15000,
      description: 'Career Transition Program (Monthly Package)',
      date: '2024-02-25',
      status: 'completed',
      transactionId: 'TXN789012348',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: '5',
      type: 'session_payment',
      amount: 5500,
      description: 'Technical Mentoring session with Emily Davis',
      date: '2024-02-20',
      status: 'completed',
      transactionId: 'TXN789012349',
      paymentMethod: 'UPI'
    },
    {
      id: '6',
      type: 'session_payment',
      amount: 4500,
      description: 'Career Guidance session with Michael Chen',
      date: '2024-02-18',
      status: 'completed',
      transactionId: 'TXN789012350',
      paymentMethod: 'Bank Transfer'
    }
  ];

  paymentMethods = [
    {
      id: '1',
      type: 'bank_account',
      accountNumber: '****5678',
      bankName: 'ICICI Bank',
      accountHolderName: 'Dr. Sarah Mentor',
      ifscCode: 'ICIC0001234',
      isDefault: true,
      isVerified: true
    },
    {
      id: '2',
      type: 'upi',
      upiId: 'mentor@paytm',
      provider: 'Paytm',
      isDefault: false,
      isVerified: true
    },
    {
      id: '3',
      type: 'bank_account',
      accountNumber: '****9012',
      bankName: 'HDFC Bank',
      accountHolderName: 'Dr. Sarah Mentor',
      ifscCode: 'HDFC0005678',
      isDefault: false,
      isVerified: true
    }
  ];

  selectedPeriod = 'month'; // 'week', 'month', 'year', 'all'

  // Resources data
  selectedResourceCategory = 'all'; // 'all', 'guides', 'templates', 'videos', 'tools', 'faq'
  
  resourceCategories = [
    { id: 'all', name: 'All Resources', icon: 'fas fa-th', count: 0 },
    { id: 'guides', name: 'Guides & Best Practices', icon: 'fas fa-book', count: 8 },
    { id: 'templates', name: 'Templates & Forms', icon: 'fas fa-file-alt', count: 12 },
    { id: 'videos', name: 'Video Tutorials', icon: 'fas fa-play-circle', count: 15 },
    { id: 'tools', name: 'Tools & Calculators', icon: 'fas fa-tools', count: 6 },
    { id: 'faq', name: 'FAQs', icon: 'fas fa-question-circle', count: 20 }
  ];

  mentorResources = [
    {
      id: '1',
      category: 'guides',
      title: 'Complete Mentor Guide: Getting Started',
      description: 'Comprehensive guide covering everything you need to know as a new mentor, from setting up your profile to conducting your first session.',
      type: 'PDF',
      size: '2.5 MB',
      downloads: 1245,
      rating: 4.8,
      updated: '2024-01-15',
      icon: 'fas fa-book-open',
      color: '#667eea',
      tags: ['beginner', 'setup', 'profile']
    },
    {
      id: '2',
      category: 'guides',
      title: 'Best Practices for Effective Mentoring',
      description: 'Learn proven strategies and techniques for building strong mentor-mentee relationships and achieving better outcomes.',
      type: 'PDF',
      size: '3.1 MB',
      downloads: 987,
      rating: 4.9,
      updated: '2024-02-10',
      icon: 'fas fa-star',
      color: '#f093fb',
      tags: ['best-practices', 'relationships', 'strategies']
    },
    {
      id: '3',
      category: 'templates',
      title: 'Session Planning Template',
      description: 'Professional template for planning and structuring your mentorship sessions with clear objectives and action items.',
      type: 'DOCX',
      size: '156 KB',
      downloads: 2341,
      rating: 4.7,
      updated: '2024-01-20',
      icon: 'fas fa-calendar-check',
      color: '#4facfe',
      tags: ['planning', 'session', 'template']
    },
    {
      id: '4',
      category: 'templates',
      title: 'Mentee Feedback Form Template',
      description: 'Structured feedback form template to collect comprehensive feedback from your mentees after each session.',
      type: 'DOCX',
      size: '89 KB',
      downloads: 1876,
      rating: 4.6,
      updated: '2024-02-05',
      icon: 'fas fa-comment-dots',
      color: '#43e97b',
      tags: ['feedback', 'assessment', 'forms']
    },
    {
      id: '5',
      category: 'templates',
      title: 'Goal Setting Worksheet',
      description: 'Interactive worksheet to help mentees set SMART goals and track their progress throughout the mentorship journey.',
      type: 'PDF',
      size: '234 KB',
      downloads: 1654,
      rating: 4.8,
      updated: '2024-01-28',
      icon: 'fas fa-bullseye',
      color: '#fa709a',
      tags: ['goals', 'planning', 'worksheet']
    },
    {
      id: '6',
      category: 'videos',
      title: 'Introduction to Mentorship Platform',
      description: 'Video walkthrough of the platform features, dashboard navigation, and how to schedule your first session.',
      type: 'Video',
      duration: '12:45',
      views: 3421,
      rating: 4.7,
      updated: '2024-01-12',
      icon: 'fas fa-video',
      color: '#667eea',
      tags: ['tutorial', 'platform', 'walkthrough']
    },
    {
      id: '7',
      category: 'videos',
      title: 'Effective Communication Techniques',
      description: 'Learn how to communicate effectively with mentees, ask powerful questions, and provide constructive feedback.',
      type: 'Video',
      duration: '18:30',
      views: 2890,
      rating: 4.9,
      updated: '2024-02-08',
      icon: 'fas fa-comments',
      color: '#f093fb',
      tags: ['communication', 'skills', 'techniques']
    },
    {
      id: '8',
      category: 'videos',
      title: 'Handling Difficult Conversations',
      description: 'Strategies for managing challenging situations, difficult mentees, and navigating sensitive topics during sessions.',
      type: 'Video',
      duration: '15:20',
      views: 1987,
      rating: 4.6,
      updated: '2024-02-15',
      icon: 'fas fa-handshake',
      color: '#4facfe',
      tags: ['difficult', 'conversations', 'management']
    },
    {
      id: '9',
      category: 'tools',
      title: 'Session Time Calculator',
      description: 'Calculate optimal session duration, pricing, and scheduling based on mentee goals and program type.',
      type: 'Tool',
      size: 'Web App',
      downloads: 3421,
      rating: 4.8,
      updated: '2024-01-25',
      icon: 'fas fa-calculator',
      color: '#43e97b',
      tags: ['calculator', 'scheduling', 'pricing']
    },
    {
      id: '10',
      category: 'tools',
      title: 'Progress Tracker Template',
      description: 'Track mentee progress across multiple sessions with visual progress indicators and milestone tracking.',
      type: 'Excel',
      size: '312 KB',
      downloads: 2134,
      rating: 4.7,
      updated: '2024-02-12',
      icon: 'fas fa-chart-line',
      color: '#fa709a',
      tags: ['tracking', 'progress', 'metrics']
    },
    {
      id: '11',
      category: 'faq',
      title: 'How do I get paid as a mentor?',
      description: 'Complete guide to payment processing, payout schedules, and managing your earnings on the platform.',
      type: 'Article',
      size: '5 min read',
      downloads: 0,
      rating: 4.8,
      updated: '2024-02-18',
      icon: 'fas fa-question',
      color: '#667eea',
      tags: ['payment', 'payout', 'earnings']
    },
    {
      id: '12',
      category: 'faq',
      title: 'What should I do if a mentee cancels?',
      description: 'Guidelines for handling cancellations, rescheduling policies, and managing your session calendar.',
      type: 'Article',
      size: '3 min read',
      downloads: 0,
      rating: 4.6,
      updated: '2024-02-14',
      icon: 'fas fa-calendar-times',
      color: '#f093fb',
      tags: ['cancellation', 'policy', 'scheduling']
    },
    {
      id: '13',
      category: 'guides',
      title: 'Building Your Mentor Brand',
      description: 'Strategies for creating a compelling mentor profile, showcasing your expertise, and attracting the right mentees.',
      type: 'PDF',
      size: '2.8 MB',
      downloads: 876,
      rating: 4.7,
      updated: '2024-02-20',
      icon: 'fas fa-user-tie',
      color: '#4facfe',
      tags: ['branding', 'profile', 'marketing']
    },
    {
      id: '14',
      category: 'templates',
      title: 'Welcome Email Template',
      description: 'Professional email template to welcome new mentees and set expectations for the mentorship journey.',
      type: 'DOCX',
      size: '67 KB',
      downloads: 1543,
      rating: 4.5,
      updated: '2024-01-18',
      icon: 'fas fa-envelope',
      color: '#43e97b',
      tags: ['email', 'communication', 'welcome']
    },
    {
      id: '15',
      category: 'videos',
      title: 'Platform Feature Deep Dive',
      description: 'Comprehensive overview of advanced platform features including analytics, reporting, and mentor tools.',
      type: 'Video',
      duration: '22:15',
      views: 1678,
      rating: 4.8,
      updated: '2024-02-22',
      icon: 'fas fa-cogs',
      color: '#fa709a',
      tags: ['features', 'advanced', 'platform']
    }
  ];

  featuredResources = [
    {
      id: '1',
      title: 'Complete Mentor Guide: Getting Started',
      category: 'guides',
      icon: 'fas fa-book-open',
      color: '#667eea'
    },
    {
      id: '3',
      title: 'Session Planning Template',
      category: 'templates',
      icon: 'fas fa-calendar-check',
      color: '#4facfe'
    },
    {
      id: '6',
      title: 'Introduction to Mentorship Platform',
      category: 'videos',
      icon: 'fas fa-video',
      color: '#667eea'
    }
  ];

  faqItems = [
    {
      id: '1',
      question: 'How do I get paid as a mentor?',
      answer: 'Payments are processed automatically after each completed session. You can set up your payment method in the Earnings & Payments section. Payments are typically processed within 3-5 business days.',
      category: 'payment'
    },
    {
      id: '2',
      question: 'What should I do if a mentee cancels?',
      answer: 'If a mentee cancels more than 24 hours before the session, you can reschedule or mark it as cancelled. Cancellations within 24 hours may be subject to cancellation policies outlined in your mentor agreement.',
      category: 'scheduling'
    },
    {
      id: '3',
      question: 'How many mentees can I have at once?',
      answer: 'The number of mentees you can have depends on your availability and mentor tier. You can set your maximum mentee capacity in your settings. We recommend starting with 3-5 mentees to ensure quality mentorship.',
      category: 'capacity'
    },
    {
      id: '4',
      question: 'What qualifications do I need to become a mentor?',
      answer: 'We look for mentors with relevant experience, expertise in their domain, and a passion for helping others. Typically, mentors have 5+ years of professional experience and demonstrated success in their field.',
      category: 'qualifications'
    },
    {
      id: '5',
      question: 'How do I handle difficult mentees?',
      answer: 'We provide resources and training on managing challenging situations. If you encounter persistent issues, you can contact our support team for guidance. We also have a video tutorial on "Handling Difficult Conversations" in the resources section.',
      category: 'support'
    },
    {
      id: '6',
      question: 'Can I offer group mentoring sessions?',
      answer: 'Yes! Group mentoring sessions are available for mentors who want to work with multiple mentees simultaneously. You can create group programs and set pricing for group sessions in your mentor dashboard.',
      category: 'sessions'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
  
  // Navigation methods
  setActiveSection(section: string): void {
    this.activeSection = section;
  }
  
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  
  // Utility methods
  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      case 'on-track': return 'status-on-track';
      case 'needs-attention': return 'status-needs-attention';
      case 'excellent': return 'status-excellent';
      case 'active': return 'status-active';
      case 'completed': return 'status-completed';
      default: return '';
    }
  }
  
  getActivityIcon(type: string): string {
    switch (type) {
      case 'mentorship': return 'fas fa-user-graduate';
      case 'session': return 'fas fa-handshake';
      case 'mentee': return 'fas fa-user-plus';
      case 'achievement': return 'fas fa-trophy';
      case 'review': return 'fas fa-star';
      default: return 'fas fa-info-circle';
    }
  }
  
  getSectionTitle(): string {
    switch (this.activeSection) {
      case 'overview': return 'Mentor Dashboard';
      case 'mentees': return 'My Mentees';
      case 'programs': return 'Mentorship Programs';
      case 'sessions': return 'Mentorship Sessions';
      case 'analytics': return 'Mentorship Analytics';
      case 'earnings': return 'Earnings & Payments';
      case 'resources': return 'Mentor Resources';
      case 'settings': return 'Account Settings';
      default: return 'Mentor Dashboard';
    }
  }
  
  getSectionSubtitle(): string {
    switch (this.activeSection) {
      case 'overview': return 'Welcome back! Here\'s your mentorship overview and recent activities.';
      case 'mentees': return 'Track and manage your mentees\' progress and development.';
      case 'programs': return 'Manage your mentorship programs and track their success.';
      case 'sessions': return 'Schedule and manage your mentorship sessions.';
      case 'analytics': return 'Detailed insights into your mentorship performance and impact.';
      case 'earnings': return 'Track your earnings and payment history from mentorship.';
      case 'resources': return 'Access mentor resources, tools, and best practices.';
      case 'settings': return 'Manage your mentor account and preferences.';
      default: return 'Mentor Dashboard';
    }
  }
  
  getProgressClass(progress: number): string {
    if (progress >= 80) return 'progress-excellent';
    if (progress >= 60) return 'progress-good';
    if (progress >= 40) return 'progress-fair';
    return 'progress-needs-work';
  }

  // Earnings methods
  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'failed': return 'status-failed';
      default: return '';
    }
  }

  getPaymentTypeIcon(type: string): string {
    switch (type) {
      case 'session_payment': return 'fas fa-handshake';
      case 'program_payment': return 'fas fa-graduation-cap';
      case 'refund': return 'fas fa-undo';
      case 'bonus': return 'fas fa-gift';
      default: return 'fas fa-rupee-sign';
    }
  }

  getPaymentMethodIcon(type: string): string {
    switch (type) {
      case 'bank_account': return 'fas fa-university';
      case 'upi': return 'fas fa-mobile-alt';
      case 'wallet': return 'fas fa-wallet';
      default: return 'fas fa-credit-card';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  setPeriod(period: string): void {
    this.selectedPeriod = period;
    // In real app, this would fetch data for the selected period
  }

  downloadInvoice(transactionId: string): void {
    // In real app, this would download the invoice PDF
    console.log('Downloading invoice for:', transactionId);
  }

  addPaymentMethod(): void {
    // In real app, this would open a modal to add payment method
    console.log('Adding new payment method');
  }

  // Resources methods
  setResourceCategory(category: string): void {
    this.selectedResourceCategory = category;
  }

  getFilteredResources(): any[] {
    if (this.selectedResourceCategory === 'all') {
      return this.mentorResources;
    }
    return this.mentorResources.filter(resource => resource.category === this.selectedResourceCategory);
  }

  getResourceTypeIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'pdf': return 'fas fa-file-pdf';
      case 'docx': return 'fas fa-file-word';
      case 'excel': return 'fas fa-file-excel';
      case 'video': return 'fas fa-file-video';
      case 'tool': return 'fas fa-wrench';
      case 'article': return 'fas fa-file-alt';
      default: return 'fas fa-file';
    }
  }

  getResourceTypeColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'pdf': return '#dc2626';
      case 'docx': return '#2563eb';
      case 'excel': return '#059669';
      case 'video': return '#3B82F6';
      case 'tool': return '#ea580c';
      case 'article': return '#64748b';
      default: return '#64748b';
    }
  }

  downloadResource(resourceId: string): void {
    // In real app, this would download the resource
    console.log('Downloading resource:', resourceId);
  }

  viewResource(resourceId: string): void {
    // In real app, this would open/view the resource
    console.log('Viewing resource:', resourceId);
  }

  toggleFaq(faqId: string): void {
    const faq = this.faqItems.find(f => f.id === faqId);
    if (faq) {
      // In real app, this would toggle the FAQ expansion
      console.log('Toggling FAQ:', faqId);
    }
  }

  searchResources(searchTerm: string): void {
    // In real app, this would filter resources based on search
    console.log('Searching resources:', searchTerm);
  }

  // Settings data
  activeSettingsTab = 'profile'; // 'profile', 'security', 'notifications', 'availability', 'billing', 'privacy'
  
  mentorProfile = {
    firstName: 'Dr. Sarah',
    lastName: 'Mentor',
    email: 'sarah.mentor@techwindows.com',
    phone: '+91-9876543210',
    bio: 'Senior Industry Expert with 15+ years of experience in technology and leadership development.',
    location: 'Bangalore, India',
    avatar: 'https://via.placeholder.com/100x100/2196F3/ffffff?text=SM',
    website: 'https://sarahmentor.com',
    linkedin: 'https://linkedin.com/in/sarahmentor',
    twitter: 'https://twitter.com/sarahmentor'
  };

  notificationSettings = {
    emailNotifications: {
      sessionRequests: true,
      sessionReminders: true,
      paymentReceived: true,
      newMentee: true,
      reviews: true,
      announcements: true,
      newsletter: false
    },
    pushNotifications: {
      sessionRequests: true,
      sessionReminders: true,
      messages: true,
      payments: false
    },
    smsNotifications: {
      sessionReminders: false,
      importantUpdates: true
    }
  };

  availabilitySettings = {
    timezone: 'Asia/Kolkata (IST)',
    maxMentees: 20,
    sessionDuration: 60,
    bufferTime: 15,
    availability: [
      { day: 'Monday', enabled: true, startTime: '09:00', endTime: '17:00' },
      { day: 'Tuesday', enabled: true, startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', enabled: true, startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday', enabled: true, startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', enabled: true, startTime: '09:00', endTime: '17:00' },
      { day: 'Saturday', enabled: false, startTime: '10:00', endTime: '14:00' },
      { day: 'Sunday', enabled: false, startTime: '10:00', endTime: '14:00' }
    ]
  };

  privacySettings = {
    profileVisibility: 'public', // 'public', 'private', 'verified-only'
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMenteeMessaging: true,
    allowSessionRecordings: false,
    dataSharing: {
      analytics: true,
      marketing: false,
      thirdParty: false
    }
  };

  securitySettings = {
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30, // minutes
    deviceManagement: [
      { device: 'Windows PC - Chrome', location: 'Bangalore, IN', lastActive: 'Active now', trusted: true },
      { device: 'iPhone 13 - Safari', location: 'Bangalore, IN', lastActive: '2 hours ago', trusted: true }
    ]
  };

  billingSettings = {
    taxId: 'GSTIN123456789',
    billingAddress: {
      street: '123 Tech Park',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India'
    },
    invoiceSettings: {
      autoGenerate: true,
      emailTo: 'sarah.mentor@techwindows.com',
      includeDetails: true
    }
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Settings methods
  setSettingsTab(tab: string): void {
    this.activeSettingsTab = tab;
  }

  updateProfile(): void {
    // In real app, this would save profile changes
    console.log('Updating profile:', this.mentorProfile);
  }

  updateNotifications(): void {
    // In real app, this would save notification settings
    console.log('Updating notifications:', this.notificationSettings);
  }

  updateAvailability(): void {
    // In real app, this would save availability settings
    console.log('Updating availability:', this.availabilitySettings);
  }

  updatePrivacy(): void {
    // In real app, this would save privacy settings
    console.log('Updating privacy:', this.privacySettings);
  }

  updateSecurity(): void {
    // In real app, this would save security settings
    console.log('Updating security:', this.securitySettings);
  }

  updateBilling(): void {
    // In real app, this would save billing settings
    console.log('Updating billing:', this.billingSettings);
  }

  changePassword(): void {
    // In real app, this would change password
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    console.log('Changing password');
    this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
  }

  toggleTwoFactorAuth(): void {
    this.securitySettings.twoFactorAuth = !this.securitySettings.twoFactorAuth;
    this.updateSecurity();
  }

  toggleDayAvailability(day: string): void {
    const daySetting = this.availabilitySettings.availability.find(d => d.day === day);
    if (daySetting) {
      daySetting.enabled = !daySetting.enabled;
      this.updateAvailability();
    }
  }

  uploadAvatar(event: any): void {
    // In real app, this would upload avatar
    const file = event.target.files[0];
    if (file) {
      console.log('Uploading avatar:', file.name);
      // Handle file upload
    }
  }

  exportData(): void {
    // In real app, this would export user data
    console.log('Exporting data');
  }

  deactivateAccount(): void {
    // In real app, this would show confirmation and deactivate account
    if (confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
      console.log('Deactivating account');
    }
  }

  deleteAccount(): void {
    // In real app, this would show confirmation and delete account
    if (confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      console.log('Deleting account');
    }
  }

  getNotificationDescription(key: string): string {
    const descriptions: { [key: string]: string } = {
      sessionRequests: 'Get notified when mentees request sessions',
      sessionReminders: 'Receive reminders before upcoming sessions',
      paymentReceived: 'Get notified when payments are received',
      newMentee: 'Notification when a new mentee joins your program',
      reviews: 'Get notified when mentees leave reviews',
      announcements: 'Receive platform announcements and updates',
      newsletter: 'Subscribe to our monthly newsletter',
      messages: 'Push notifications for new messages',
      payments: 'Push notifications for payment updates'
    };
    return descriptions[key] || '';
  }

  getDataSharingDescription(key: string): string {
    const descriptions: { [key: string]: string } = {
      analytics: 'Help us improve by sharing usage analytics',
      marketing: 'Receive marketing communications and offers',
      thirdParty: 'Allow sharing data with trusted partners'
    };
    return descriptions[key] || '';
  }

  // Helper methods for template access
  getEmailNotificationValue(key: string): boolean {
    return (this.notificationSettings.emailNotifications as any)[key] || false;
  }

  setEmailNotificationValue(key: string, value: boolean): void {
    (this.notificationSettings.emailNotifications as any)[key] = value;
    this.updateNotifications();
  }

  getPushNotificationValue(key: string): boolean {
    return (this.notificationSettings.pushNotifications as any)[key] || false;
  }

  setPushNotificationValue(key: string, value: boolean): void {
    (this.notificationSettings.pushNotifications as any)[key] = value;
    this.updateNotifications();
  }

  getDataSharingValue(key: string): boolean {
    return (this.privacySettings.dataSharing as any)[key] || false;
  }

  setDataSharingValue(key: string, value: boolean): void {
    (this.privacySettings.dataSharing as any)[key] = value;
    this.updatePrivacy();
  }
}

