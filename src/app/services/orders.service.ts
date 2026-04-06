import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface OrderItem {
  id: string;
  name: string;
  type: 'course' | 'training' | 'mentoring';
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  instructor?: string;
  duration?: string;
  accessExpiry?: string;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ShippingAddress extends BillingAddress {}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  billingAddress: BillingAddress;
  shippingAddress: ShippingAddress;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  cancellationReason?: string;
  refundAmount?: number;
  refundDate?: string;
  orderHistory?: Array<{
    date: string;
    status: string;
    description: string;
  }>;
}

export interface CreateOrderRequest {
  items: Array<{
    id: string;
    type: string;
    quantity: number;
  }>;
  billingAddress: BillingAddress;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
}

export interface OrderStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  thisMonth: {
    orders: number;
    spent: number;
  };
  lastMonth: {
    orders: number;
    spent: number;
  };
}

export interface OrderTracking {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  events: Array<{
    date: string;
    status: string;
    location: string;
    description: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private apiService: ApiService) { }

  // Get all orders for current user
  getOrders(): Observable<Order[]> {
    return this.apiService.getAuth<Order[]>('/orders').pipe(
      map((response: ApiResponse<Order[]>) => response.data || [])
    );
  }

  // Get order by ID
  getOrder(id: string): Observable<Order> {
    return this.apiService.getAuth<Order>(`/orders/${id}`).pipe(
      map((response: ApiResponse<Order>) => response.data!)
    );
  }

  // Create new order
  createOrder(data: CreateOrderRequest): Observable<Order> {
    return this.apiService.postAuth<Order>('/orders', data).pipe(
      map((response: ApiResponse<Order>) => response.data!)
    );
  }

  // Update order status
  updateOrderStatus(id: string, status: string, notes?: string): Observable<any> {
    return this.apiService.patchAuth<any>(`/orders/${id}/status`, { status, notes }).pipe(
      map((response: ApiResponse<any>) => response.data!)
    );
  }

  // Cancel order
  cancelOrder(id: string, reason?: string): Observable<any> {
    return this.apiService.patchAuth<any>(`/orders/${id}/cancel`, { reason }).pipe(
      map((response: ApiResponse<any>) => response.data!)
    );
  }

  // Get order statistics
  getOrderStats(): Observable<OrderStats> {
    return this.apiService.getAuth<OrderStats>('/orders/stats/summary').pipe(
      map((response: ApiResponse<OrderStats>) => response.data!)
    );
  }

  // Get order tracking
  getOrderTracking(id: string): Observable<OrderTracking> {
    return this.apiService.getAuth<OrderTracking>(`/orders/${id}/tracking`).pipe(
      map((response: ApiResponse<OrderTracking>) => response.data!)
    );
  }

  // Get order statuses
  getOrderStatuses(): string[] {
    return ['pending', 'processing', 'completed', 'cancelled', 'refunded'];
  }

  // Get payment methods
  getPaymentMethods(): string[] {
    return ['credit_card', 'paypal', 'bank_transfer', 'cash'];
  }

  // Get payment statuses
  getPaymentStatuses(): string[] {
    return ['pending', 'paid', 'failed', 'refunded'];
  }

  // Format order status
  formatOrderStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'processing': 'Processing',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded'
    };
    return statusMap[status] || status;
  }

  // Format payment status
  formatPaymentStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'paid': 'Paid',
      'failed': 'Failed',
      'refunded': 'Refunded'
    };
    return statusMap[status] || status;
  }

  // Format payment method
  formatPaymentMethod(method: string): string {
    const methodMap: { [key: string]: string } = {
      'credit_card': 'Credit Card',
      'paypal': 'PayPal',
      'bank_transfer': 'Bank Transfer',
      'cash': 'Cash'
    };
    return methodMap[method] || method;
  }

  // Calculate order total
  calculateOrderTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Format currency
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Format date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Format date and time
  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

