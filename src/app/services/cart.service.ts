import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface CartItem {
  id: string;
  type: 'course' | 'training' | 'mentoring';
  courseId?: string;
  name: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  image: string;
  duration: string;
  level: string;
  category: string;
  addedAt: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  lastUpdated: string;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  savings: number;
  appliedCoupon?: {
    code: string;
    discount: number;
  };
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount: number;
  maxDiscount: number;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
}

export interface CartRecommendation {
  id: string;
  type: 'course' | 'training' | 'mentoring';
  courseId: string;
  name: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  image: string;
  duration: string;
  level: string;
  category: string;
  reason: string;
}

export interface CheckoutRequest {
  billingAddress: any;
  shippingAddress: any;
  paymentMethod: string;
  couponCode?: string;
  notes?: string;
}

export interface CheckoutResponse {
  order: any;
  paymentUrl: string;
  clearCart: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadCart();
  }

  // Load cart from API
  private loadCart(): void {
    this.getCart().subscribe();
  }

  // Get user's cart
  getCart(): Observable<Cart> {
    return this.apiService.getAuth<Cart>('/cart').pipe(
      map((response: ApiResponse<Cart>) => {
        const cart = response.data!;
        this.cartSubject.next(cart);
        return cart;
      })
    );
  }

  // Add item to cart
  addItem(courseId: string, quantity: number = 1): Observable<CartItem> {
    return this.apiService.postAuth<CartItem>('/cart/items', { courseId, quantity }).pipe(
      map((response: ApiResponse<CartItem>) => {
        // Reload cart after adding item
        this.loadCart();
        return response.data!;
      })
    );
  }

  // Update cart item quantity
  updateItemQuantity(itemId: string, quantity: number): Observable<any> {
    return this.apiService.patchAuth<any>(`/cart/items/${itemId}`, { quantity }).pipe(
      map((response: ApiResponse<any>) => {
        // Reload cart after updating item
        this.loadCart();
        return response.data!;
      })
    );
  }

  // Remove item from cart
  removeItem(itemId: string): Observable<any> {
    return this.apiService.deleteAuth<any>(`/cart/items/${itemId}`).pipe(
      map((response: ApiResponse<any>) => {
        // Reload cart after removing item
        this.loadCart();
        return response.data!;
      })
    );
  }

  // Clear cart
  clearCart(): Observable<any> {
    return this.apiService.deleteAuth<any>('/cart/clear').pipe(
      map((response: ApiResponse<any>) => {
        this.cartSubject.next(null);
        return response.data!;
      })
    );
  }

  // Apply coupon code
  applyCoupon(code: string): Observable<any> {
    return this.apiService.postAuth<any>('/cart/coupon', { code }).pipe(
      map((response: ApiResponse<any>) => {
        // Reload cart after applying coupon
        this.loadCart();
        return response.data!;
      })
    );
  }

  // Remove coupon
  removeCoupon(): Observable<any> {
    return this.apiService.deleteAuth<any>('/cart/coupon').pipe(
      map((response: ApiResponse<any>) => {
        // Reload cart after removing coupon
        this.loadCart();
        return response.data!;
      })
    );
  }

  // Get cart summary
  getCartSummary(): Observable<CartSummary> {
    return this.apiService.getAuth<CartSummary>('/cart/summary').pipe(
      map((response: ApiResponse<CartSummary>) => response.data!)
    );
  }

  // Checkout cart
  checkout(data: CheckoutRequest): Observable<CheckoutResponse> {
    return this.apiService.postAuth<CheckoutResponse>('/cart/checkout', data).pipe(
      map((response: ApiResponse<CheckoutResponse>) => {
        // Clear cart after successful checkout
        if (response.data?.clearCart) {
          this.cartSubject.next(null);
        }
        return response.data!;
      })
    );
  }

  // Get cart recommendations
  getCartRecommendations(): Observable<CartRecommendation[]> {
    return this.apiService.getAuth<CartRecommendation[]>('/cart/recommendations').pipe(
      map((response: ApiResponse<CartRecommendation[]>) => response.data || [])
    );
  }

  // Get current cart value
  getCurrentCart(): Cart | null {
    return this.cartSubject.value;
  }

  // Get cart item count
  getCartItemCount(): number {
    const cart = this.getCurrentCart();
    return cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
  }

  // Check if cart is empty
  isCartEmpty(): boolean {
    const cart = this.getCurrentCart();
    return !cart || cart.items.length === 0;
  }

  // Calculate cart total
  calculateCartTotal(): number {
    const cart = this.getCurrentCart();
    return cart ? cart.total : 0;
  }

  // Calculate cart subtotal
  calculateCartSubtotal(): number {
    const cart = this.getCurrentCart();
    return cart ? cart.subtotal : 0;
  }

  // Calculate cart discount
  calculateCartDiscount(): number {
    const cart = this.getCurrentCart();
    return cart ? cart.discount : 0;
  }

  // Check if item is in cart
  isItemInCart(courseId: string): boolean {
    const cart = this.getCurrentCart();
    return cart ? cart.items.some(item => item.courseId === courseId) : false;
  }

  // Get item quantity in cart
  getItemQuantity(courseId: string): number {
    const cart = this.getCurrentCart();
    const item = cart?.items.find(item => item.courseId === courseId);
    return item ? item.quantity : 0;
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
      month: 'short',
      day: 'numeric'
    });
  }
}

