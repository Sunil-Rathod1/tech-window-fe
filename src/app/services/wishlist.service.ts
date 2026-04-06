import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface WishlistItem {
  id: string;
  name: string;
  title: string;
  description: string;
  duration: string;
  modules: number;
  lectures: number;
  students: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  category: string;
  level: string;
  technologies: string[];
  status: string[];
  image: string;
  instructor: string;
  rating: number;
  reviews: number;
  addedDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: WishlistItem[] = [];
  private wishlistSubject = new BehaviorSubject<WishlistItem[]>(this.wishlistItems);
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor(private apiService: ApiService) {
    // Initialize wishlist from API or fallback to local storage
    this.initializeWishlist().subscribe();
  }

  // Initialize with sample courses
  private initializeSampleCourses(): void {
    const sampleCourses = [
      {
        id: 'course-1',
        title: 'Complete Web Development Bootcamp',
        description: 'Learn HTML, CSS, JavaScript, React, Node.js and build real-world projects',
        duration: '12 weeks',
        modules: 15,
        lectures: 120,
        students: '15,000+',
        price: '₹2,999',
        originalPrice: '₹4,999',
        discount: '40',
        category: 'Web Development',
        level: 'Beginner',
        technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
        status: ['NEW', 'POPULAR'],
        image: 'course-1.jpg',
        instructor: 'John Smith',
        rating: 4.8,
        reviews: 2500
      },
      {
        id: 'course-2',
        title: 'AWS Certified Cloud Practitioner 2025 [CLF-C02]',
        description: 'Master AWS cloud fundamentals and prepare for the CLF-C02 certification exam',
        duration: '8 weeks',
        modules: 12,
        lectures: 85,
        students: '8,500+',
        price: '₹3,499',
        originalPrice: '₹5,999',
        discount: '42',
        category: 'Cloud Computing',
        level: 'Beginner',
        technologies: ['AWS', 'Cloud Computing', 'DevOps', 'Linux'],
        status: ['NEW'],
        image: 'course-2.jpg',
        instructor: 'Sarah Johnson',
        rating: 4.7,
        reviews: 1200
      },
      {
        id: 'course-3',
        title: 'Python Data Science Masterclass',
        description: 'Complete Python programming for data science, machine learning, and analytics',
        duration: '10 weeks',
        modules: 18,
        lectures: 150,
        students: '12,000+',
        price: '₹2,799',
        originalPrice: '₹4,499',
        discount: '38',
        category: 'Data Science',
        level: 'Intermediate',
        technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn'],
        status: ['POPULAR'],
        image: 'course-3.jpg',
        instructor: 'Mike Chen',
        rating: 4.9,
        reviews: 3200
      },
      {
        id: 'course-4',
        title: 'UI/UX Design Fundamentals',
        description: 'Learn user interface and user experience design principles and tools',
        duration: '6 weeks',
        modules: 10,
        lectures: 75,
        students: '6,500+',
        price: '₹1,999',
        originalPrice: '₹3,499',
        discount: '43',
        category: 'Design',
        level: 'Beginner',
        technologies: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
        status: ['NEW'],
        image: 'course-4.jpg',
        instructor: 'Emily Davis',
        rating: 4.6,
        reviews: 1800
      },
      {
        id: 'course-5',
        title: 'DevOps Engineering Course',
        description: 'Master DevOps practices, Docker, Kubernetes, and CI/CD pipelines',
        duration: '14 weeks',
        modules: 20,
        lectures: 180,
        students: '9,200+',
        price: '₹4,199',
        originalPrice: '₹6,999',
        discount: '40',
        category: 'DevOps',
        level: 'Advanced',
        technologies: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Linux'],
        status: ['POPULAR'],
        image: 'course-5.jpg',
        instructor: 'Alex Rodriguez',
        rating: 4.8,
        reviews: 2100
      }
    ];

    // Add sample courses to wishlist
    sampleCourses.forEach(course => {
      this.addToWishlist(course);
    });
  }

  // Add course to wishlist
  addToWishlist(course: any): boolean {
    const existingItem = this.wishlistItems.find(item => item.id === course.id);
    
    if (existingItem) {
      return false; // Already in wishlist
    }

    const wishlistItem: WishlistItem = {
      id: course.id,
      name: course.name || course.title,
      title: course.title || course.name,
      description: course.description,
      duration: course.duration,
      modules: course.modules,
      lectures: course.lectures || course.modules || 0,
      students: course.students,
      price: course.price,
      originalPrice: course.originalPrice,
      discount: course.discount,
      category: course.category,
      level: course.level,
      technologies: course.technologies || [],
      status: course.status || [],
      image: course.image,
      instructor: course.instructor,
      rating: course.rating,
      reviews: course.reviews,
      addedDate: new Date()
    };

    this.wishlistItems.push(wishlistItem);
    this.wishlistSubject.next([...this.wishlistItems]);
    this.saveWishlistToStorage();
    return true;
  }

  // Remove course from wishlist
  removeFromWishlist(courseId: string): boolean {
    const index = this.wishlistItems.findIndex(item => item.id === courseId);
    
    if (index === -1) {
      return false; // Not in wishlist
    }

    this.wishlistItems.splice(index, 1);
    this.wishlistSubject.next([...this.wishlistItems]);
    this.saveWishlistToStorage();
    return true;
  }

  // Check if course is in wishlist
  isInWishlist(courseId: string): boolean {
    return this.wishlistItems.some(item => item.id === courseId);
  }

  // Get all wishlist items
  getWishlistItems(): WishlistItem[] {
    return [...this.wishlistItems];
  }

  // Get wishlist count
  getWishlistCount(): number {
    return this.wishlistItems.length;
  }

  // Clear all wishlist items
  clearWishlist(): void {
    this.wishlistItems = [];
    this.wishlistSubject.next([]);
    this.saveWishlistToStorage();
  }

  // Save wishlist to localStorage
  private saveWishlistToStorage(): void {
    try {
      localStorage.setItem('techwindows-wishlist', JSON.stringify(this.wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }

  // Load wishlist from localStorage
  private loadWishlistFromStorage(): void {
    try {
      const stored = localStorage.getItem('techwindows-wishlist');
      if (stored) {
        this.wishlistItems = JSON.parse(stored).map((item: any) => ({
          ...item,
          addedDate: new Date(item.addedDate)
        }));
        this.wishlistSubject.next([...this.wishlistItems]);
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      this.wishlistItems = [];
    }
  }

  // Toggle wishlist status
  toggleWishlist(course: any): { added: boolean; message: string } {
    try {
      if (!course || !course.id) {
        console.error('Invalid course data provided to toggleWishlist');
        return { added: false, message: 'Invalid course data' };
      }

      if (this.isInWishlist(course.id)) {
        this.removeFromWishlist(course.id);
        return { added: false, message: 'Removed from wishlist' };
      } else {
        this.addToWishlist(course);
        return { added: true, message: 'Added to wishlist' };
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return { added: false, message: 'Error updating wishlist' };
    }
  }

  // ===== API INTEGRATION METHODS =====

  // Get wishlist from API
  getWishlistFromAPI(): Observable<WishlistItem[]> {
    return this.apiService.getAuth<WishlistItem[]>('/wishlist').pipe(
      map((response: ApiResponse<WishlistItem[]>) => {
        const items = response.data || [];
        this.wishlistItems = items.map(item => ({
          ...item,
          addedDate: new Date(item.addedDate)
        }));
        this.wishlistSubject.next([...this.wishlistItems]);
        this.saveWishlistToStorage();
        return this.wishlistItems;
      }),
      catchError(error => {
        console.error('Error fetching wishlist from API:', error);
        // Fallback to local storage
        return of(this.wishlistItems);
      })
    );
  }

  // Add item to wishlist via API
  addToWishlistAPI(itemId: string, itemType: 'course' | 'institute' | 'trainer' | 'mentor'): Observable<boolean> {
    return this.apiService.postAuth<any>('/wishlist', { itemId, itemType }).pipe(
      map((response: ApiResponse<any>) => {
        if (response.success) {
          // Refresh wishlist from API
          this.getWishlistFromAPI().subscribe();
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Error adding to wishlist via API:', error);
        return of(false);
      })
    );
  }

  // Remove item from wishlist via API
  removeFromWishlistAPI(itemId: string): Observable<boolean> {
    return this.apiService.deleteAuth<any>(`/wishlist/${itemId}`).pipe(
      map((response: ApiResponse<any>) => {
        if (response.success) {
          // Refresh wishlist from API
          this.getWishlistFromAPI().subscribe();
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Error removing from wishlist via API:', error);
        return of(false);
      })
    );
  }

  // Clear wishlist via API
  clearWishlistAPI(): Observable<boolean> {
    return this.apiService.deleteAuth<any>('/wishlist').pipe(
      map((response: ApiResponse<any>) => {
        if (response.success) {
          this.wishlistItems = [];
          this.wishlistSubject.next([]);
          this.saveWishlistToStorage();
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Error clearing wishlist via API:', error);
        return of(false);
      })
    );
  }

  // Get wishlist statistics
  getWishlistStats(): Observable<{
    totalItems: number;
    coursesCount: number;
    institutesCount: number;
    trainersCount: number;
    mentorsCount: number;
  }> {
    return this.apiService.getAuth<any>('/wishlist/stats').pipe(
      map((response: ApiResponse<any>) => response.data!),
      catchError(error => {
        console.error('Error fetching wishlist stats:', error);
        return of({
          totalItems: this.wishlistItems.length,
          coursesCount: this.wishlistItems.filter(item => item.category).length,
          institutesCount: 0,
          trainersCount: 0,
          mentorsCount: 0
        });
      })
    );
  }

  // Sync local wishlist with API
  syncWishlistWithAPI(): Observable<boolean> {
    return this.getWishlistFromAPI().pipe(
      map(() => true),
      catchError(error => {
        console.error('Error syncing wishlist with API:', error);
        return of(false);
      })
    );
  }

  // Initialize wishlist (load from API or fallback to local)
  initializeWishlist(): Observable<WishlistItem[]> {
    return this.getWishlistFromAPI().pipe(
      catchError(error => {
        console.error('Error initializing wishlist from API, using local storage:', error);
        this.loadWishlistFromStorage();
        
        // If no items in localStorage, add sample courses
        if (this.wishlistItems.length === 0) {
          this.initializeSampleCourses();
        }
        
        return of(this.wishlistItems);
      })
    );
  }
}
