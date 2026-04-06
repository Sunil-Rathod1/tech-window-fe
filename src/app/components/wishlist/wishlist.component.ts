import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService, WishlistItem } from 'src/app/services/wishlist.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit, OnDestroy {
  public wishlistItems: WishlistItem[] = [];
  public isLoading: boolean = true;
  public isAuthenticated: boolean = false;
  private wishlistSubscription: Subscription = new Subscription();

  constructor(
    private wishlistService: WishlistService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    if (!this.isAuthenticated) {
      this.router.navigate(['/Home']);
      return;
    }

    // Subscribe to wishlist changes
    this.wishlistSubscription = this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistItems = items;
      this.isLoading = false;
    });

    // Initialize wishlist from API or fallback to local storage
    this.wishlistService.initializeWishlist().subscribe({
      next: (items) => {
        this.wishlistItems = items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error initializing wishlist:', error);
        // Fallback to local storage
        this.wishlistItems = this.wishlistService.getWishlistItems();
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  // Remove item from wishlist
  removeFromWishlist(item: WishlistItem): void {
    if (confirm(`Are you sure you want to remove "${item.title}" from your wishlist?`)) {
      // Try API first, fallback to local
      this.wishlistService.removeFromWishlistAPI(item.id).subscribe({
        next: (success) => {
          if (!success) {
            // Fallback to local removal
            this.wishlistService.removeFromWishlist(item.id);
          }
        },
        error: (error) => {
          console.error('Error removing from wishlist via API:', error);
          // Fallback to local removal
          this.wishlistService.removeFromWishlist(item.id);
        }
      });
    }
  }

  // Clear entire wishlist
  clearWishlist(): void {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      // Try API first, fallback to local
      this.wishlistService.clearWishlistAPI().subscribe({
        next: (success) => {
          if (!success) {
            // Fallback to local clear
            this.wishlistService.clearWishlist();
          }
        },
        error: (error) => {
          console.error('Error clearing wishlist via API:', error);
          // Fallback to local clear
          this.wishlistService.clearWishlist();
        }
      });
    }
  }

  // Navigate to course details
  goToCourseDetails(courseId: string): void {
    this.router.navigate(['/Course-details', courseId]);
  }

  // Get course image path
  getCourseImagePath(imageName: string): string {
    return `/assets/photos/courses/${imageName}`;
  }

  // Format date
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Get wishlist count
  getWishlistCount(): number {
    return this.wishlistItems.length;
  }

  // Get unique categories count
  getUniqueCategories(): number {
    const categories = new Set(this.wishlistItems.map(item => item.category));
    return categories.size;
  }

  // Get last updated date
  getLastUpdatedDate(): string {
    if (this.wishlistItems.length === 0) return 'Never';
    
    const latestDate = Math.max(...this.wishlistItems.map(item => 
      new Date(item.addedDate).getTime()
    ));
    
    return new Date(latestDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}