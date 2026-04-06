import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedStatus: string = '';
  sortBy: string = 'date';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
    this.filteredOrders = [...this.orders];
  }

  loadOrders(): void {
    // Sample orders data
    this.orders = [
      {
        id: 'ORD-001',
        courseName: 'Complete Web Development Bootcamp',
        instructor: 'John Smith',
        amount: 2999,
        status: 'completed',
        date: new Date('2024-01-15'),
        paymentMethod: 'Credit Card',
        duration: '12 weeks',
        level: 'Beginner',
        progress: 85,
        courseId: 'course-1',
        invoice: 'invoice-001.pdf'
      },
      {
        id: 'ORD-002',
        courseName: 'Advanced React Development',
        instructor: 'Sarah Johnson',
        amount: 1999,
        status: 'pending',
        date: new Date('2024-01-20'),
        paymentMethod: 'UPI',
        duration: '8 weeks',
        level: 'Intermediate',
        progress: 0,
        courseId: 'course-2',
        invoice: null
      },
      {
        id: 'ORD-003',
        courseName: 'Python Data Science Masterclass',
        instructor: 'Mike Chen',
        amount: 2499,
        status: 'processing',
        date: new Date('2024-01-18'),
        paymentMethod: 'Net Banking',
        duration: '10 weeks',
        level: 'Advanced',
        progress: 0,
        courseId: 'course-3',
        invoice: null
      },
      {
        id: 'ORD-004',
        courseName: 'UI/UX Design Fundamentals',
        instructor: 'Emily Davis',
        amount: 1799,
        status: 'completed',
        date: new Date('2024-01-10'),
        paymentMethod: 'Credit Card',
        duration: '6 weeks',
        level: 'Beginner',
        progress: 100,
        courseId: 'course-4',
        invoice: 'invoice-004.pdf'
      },
      {
        id: 'ORD-005',
        courseName: 'DevOps Engineering Course',
        instructor: 'Alex Rodriguez',
        amount: 3299,
        status: 'cancelled',
        date: new Date('2024-01-12'),
        paymentMethod: 'Credit Card',
        duration: '14 weeks',
        level: 'Advanced',
        progress: 0,
        courseId: 'course-5',
        invoice: null
      }
    ];
  }

  getTotalOrders(): number {
    return this.orders.length;
  }

  getCompletedOrders(): number {
    return this.orders.filter(order => order.status === 'completed').length;
  }

  getPendingOrders(): number {
    return this.orders.filter(order => order.status === 'pending' || order.status === 'processing').length;
  }

  filterOrders(): void {
    if (!this.selectedStatus) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    }
    this.sortOrders();
  }

  sortOrders(): void {
    this.filteredOrders.sort((a, b) => {
      switch (this.sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'amount':
          return b.amount - a.amount;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'course':
          return a.courseName.localeCompare(b.courseName);
        default:
          return 0;
      }
    });
  }

  resetFilters(): void {
    this.selectedStatus = '';
    this.sortBy = 'date';
    this.filteredOrders = [...this.orders];
    this.sortOrders();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  getCourseImage(courseName: string): string {
    const imageMap: { [key: string]: string } = {
      'Complete Web Development Bootcamp': 'assets/photos/courses/course-1.jpg',
      'Advanced React Development': 'assets/photos/courses/course-2.jpg',
      'Python Data Science Masterclass': 'assets/photos/courses/course-3.jpg',
      'UI/UX Design Fundamentals': 'assets/photos/courses/course-4.jpg',
      'DevOps Engineering Course': 'assets/photos/courses/course-5.jpg'
    };
    return imageMap[courseName] || 'assets/photos/courses/course-1.jpg';
  }

  viewOrderDetails(orderId: string): void {
    console.log('Viewing order details for:', orderId);
    // Navigate to order details page
    this.router.navigate(['/order-details', orderId]);
  }

  downloadInvoice(invoice: string): void {
    console.log('Downloading invoice:', invoice);
    // Implement invoice download logic
  }

  continueCourse(courseId: string): void {
    console.log('Continuing course:', courseId);
    // Navigate to course learning page
    this.router.navigate(['/course', courseId]);
  }

  trackOrder(orderId: string): void {
    console.log('Tracking order:', orderId);
    // Navigate to order tracking page
    this.router.navigate(['/track-order', orderId]);
  }

  browseCourses(): void {
    this.router.navigate(['/courses']);
  }
}
