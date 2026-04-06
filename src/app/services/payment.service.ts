import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';

// Interfaces for Payment Data
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  description: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  clientSecret: string;
  metadata: { [key: string]: any };
  createdAt: Date;
  paymentMethod?: string;
}

export interface Payment {
  id: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending' | 'canceled';
  paymentMethod: {
    id: string;
    type: 'card' | 'upi' | 'netbanking' | 'wallet';
    card?: {
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
      funding?: string;
    };
    upi?: {
      vpa: string;
      bank: string;
    };
  };
  receipt: {
    id: string;
    url: string;
  };
  metadata: { [key: string]: any };
  createdAt: Date;
  paidAt?: Date;
  failedAt?: Date;
  failureReason?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    funding: string;
  };
  upi?: {
    vpa: string;
    bank: string;
  };
  isDefault: boolean;
  createdAt: Date;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending' | 'canceled';
  reason: string;
  metadata: { [key: string]: any };
  createdAt: Date;
  processedAt?: Date;
}

export interface BillingInfo {
  customer: {
    id: string;
    email: string;
    name: string;
    phone: string;
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  taxId: string;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: Date;
  subscription: {
    id: string;
    status: 'active' | 'inactive' | 'canceled' | 'past_due';
    plan: string;
    amount: number;
    currency: string;
    interval: 'month' | 'year';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  };
  invoices: {
    id: string;
    amount: number;
    currency: string;
    status: 'paid' | 'pending' | 'failed';
    dueDate: Date;
    paidAt?: Date;
    downloadUrl: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api/payments';

  constructor(private apiService: ApiService) { }

  // Payment Intent Methods
  createPaymentIntent(amount: number, currency: string = 'INR', description?: string, metadata?: any, paymentMethod?: string): Observable<PaymentIntent> {
    const paymentData = {
      amount,
      currency,
      description,
      metadata,
      paymentMethod
    };
    
    return this.apiService.post<PaymentIntent>(`${this.apiUrl}/create-intent`, paymentData)
      .pipe(map(response => response.data || (response as unknown as PaymentIntent)));
  }

  confirmPayment(paymentIntentId: string, paymentMethodId?: string): Observable<Payment> {
    const confirmData = {
      paymentIntentId,
      paymentMethodId
    };
    
    return this.apiService.post<Payment>(`${this.apiUrl}/confirm`, confirmData)
      .pipe(map(response => response.data || (response as unknown as Payment)));
  }

  // Payment Method Methods
  getPaymentMethods(type?: string): Observable<PaymentMethod[]> {
    const params: any = {};
    if (type) params.type = type;
    
    return this.apiService.get<PaymentMethod[]>(`${this.apiUrl}/methods`, params)
      .pipe(map(response => response.data || (response as unknown as PaymentMethod[])));
  }

  addPaymentMethod(type: 'card' | 'upi' | 'netbanking' | 'wallet', token: string, metadata?: any): Observable<PaymentMethod> {
    const methodData = {
      type,
      token,
      metadata
    };
    
    return this.apiService.post<PaymentMethod>(`${this.apiUrl}/methods`, methodData)
      .pipe(map(response => response.data || (response as unknown as PaymentMethod)));
  }

  setDefaultPaymentMethod(methodId: string): Observable<PaymentMethod> {
    return this.apiService.put<PaymentMethod>(`${this.apiUrl}/methods/${methodId}/default`, {})
      .pipe(map(response => response.data || (response as unknown as PaymentMethod)));
  }

  deletePaymentMethod(methodId: string): Observable<{ success: boolean; message: string }> {
    return this.apiService.delete<{ success: boolean; message: string }>(`${this.apiUrl}/methods/${methodId}`)
      .pipe(map(response => response.data || (response as unknown as { success: boolean; message: string })));
  }

  // Payment History Methods
  getPaymentHistory(page: number = 1, limit: number = 20, status?: string, startDate?: Date, endDate?: Date): Observable<{ payments: Payment[], pagination: any }> {
    const params: any = { page, limit };
    if (status) params.status = status;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    
    return this.apiService.get<{ payments: Payment[], pagination: any }>(`${this.apiUrl}/history`, params)
      .pipe(map(response => response.data || (response as unknown as { payments: Payment[], pagination: any })));
  }

  getPaymentDetails(paymentId: string): Observable<Payment> {
    return this.apiService.get<Payment>(`${this.apiUrl}/${paymentId}`)
      .pipe(map(response => response.data || (response as unknown as Payment)));
  }

  // Refund Methods
  processRefund(paymentId: string, reason: string, amount?: number, metadata?: any): Observable<Refund> {
    const refundData = {
      reason,
      amount,
      metadata
    };
    
    return this.apiService.post<Refund>(`${this.apiUrl}/${paymentId}/refund`, refundData)
      .pipe(map(response => response.data || (response as unknown as Refund)));
  }

  // Billing Methods
  getBillingInfo(): Observable<BillingInfo> {
    return this.apiService.get<BillingInfo>(`${this.apiUrl}/billing`)
      .pipe(map(response => response.data || (response as unknown as BillingInfo)));
  }

  updateBillingInfo(address?: any, taxId?: string, billingCycle?: 'monthly' | 'yearly'): Observable<BillingInfo> {
    const billingData = {
      address,
      taxId,
      billingCycle
    };
    
    return this.apiService.put<BillingInfo>(`${this.apiUrl}/billing`, billingData)
      .pipe(map(response => response.data || (response as unknown as BillingInfo)));
  }

  // Utility Methods
  payForCourse(courseId: string, courseName: string, amount: number, currency: string = 'INR'): Observable<PaymentIntent> {
    const metadata = {
      courseId,
      courseName,
      type: 'course_enrollment'
    };
    
    return this.createPaymentIntent(amount, currency, `Payment for ${courseName}`, metadata);
  }

  payForCertification(certificationId: string, certificationName: string, amount: number, currency: string = 'INR'): Observable<PaymentIntent> {
    const metadata = {
      certificationId,
      certificationName,
      type: 'certification'
    };
    
    return this.createPaymentIntent(amount, currency, `Payment for ${certificationName}`, metadata);
  }

  payForMentorship(mentorshipId: string, mentorName: string, amount: number, currency: string = 'INR'): Observable<PaymentIntent> {
    const metadata = {
      mentorshipId,
      mentorName,
      type: 'mentorship'
    };
    
    return this.createPaymentIntent(amount, currency, `Payment for mentorship with ${mentorName}`, metadata);
  }

  // Format currency for display
  formatCurrency(amount: number, currency: string = 'INR'): string {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    
    return formatter.format(amount / 100); // Convert from paise/cents to main currency unit
  }

  // Validate payment method
  validatePaymentMethod(type: string, data: any): boolean {
    switch (type) {
      case 'card':
        return data.cardNumber && data.expiryMonth && data.expiryYear && data.cvv;
      case 'upi':
        return data.vpa && data.vpa.includes('@');
      case 'netbanking':
        return data.bankCode && data.accountNumber;
      case 'wallet':
        return data.walletType && data.walletId;
      default:
        return false;
    }
  }

  // Get payment method icon
  getPaymentMethodIcon(type: string): string {
    switch (type) {
      case 'card':
        return 'fas fa-credit-card';
      case 'upi':
        return 'fas fa-mobile-alt';
      case 'netbanking':
        return 'fas fa-university';
      case 'wallet':
        return 'fas fa-wallet';
      default:
        return 'fas fa-money-bill';
    }
  }

  // Get payment status color
  getPaymentStatusColor(status: string): string {
    switch (status) {
      case 'succeeded':
        return 'success';
      case 'failed':
        return 'danger';
      case 'pending':
        return 'warning';
      case 'canceled':
        return 'secondary';
      default:
        return 'primary';
    }
  }
}











