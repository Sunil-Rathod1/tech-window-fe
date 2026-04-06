import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalCartItem, LocalCartService } from 'src/app/services/local-cart.service';
import { Router } from '@angular/router';

interface RecommendedCourse {
  title: string;
  category: string;
  duration: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cartItems: LocalCartItem[] = [];
  breadcrumbs: any[] = [
    { label: 'Home', link: '/Home' },
    { label: 'Shopping Cart', link: null }
  ];
  recommendedCourses: RecommendedCourse[] = [
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

  private subscription = new Subscription();

  constructor(
    private localCartService: LocalCartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.localCartService.items$.subscribe((items) => {
        this.cartItems = items;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get subtotal(): number {
    return this.cartItems.reduce((total, item) => {
      const quantity = item.quantity ?? 1;
      return total + item.price * quantity;
    }, 0);
  }

  get discount(): number {
    return this.cartItems.reduce((total, item) => {
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
    if (!this.cartItems.length) {
      return 0;
    }
    const originalTotal = this.cartItems.reduce(
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

  clearCart(): void {
    this.localCartService.clear();
  }

  removeItem(id: string): void {
    this.localCartService.removeItem(id);
  }

  addRecommendedCourse(course: RecommendedCourse): void {
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
  }

  isRecommendedAdded(course: RecommendedCourse): boolean {
    const id = this.buildRecommendedId(course.title);
    return this.localCartService.hasItem(id);
  }

  private buildRecommendedId(title: string): string {
    return `recommended-${title.toLowerCase().replace(/\s+/g, '-')}`;
  }

  goToPayment(): void {
    // Removed validations - proceed directly to payment gateway
    this.router.navigate(['/payment-gateway']);
  }
}
