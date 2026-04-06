import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface NewsAuthor {
  name: string;
  avatar: string;
  title: string;
  bio: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: NewsAuthor;
  category: string;
  tags: string[];
  image: string;
  publishedAt: string;
  readTime: string;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
  color: string;
}

export interface NewsComment {
  id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  likes: number;
}

export interface NewsFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  sort?: 'publishedAt' | 'views' | 'likes' | 'comments';
  order?: 'asc' | 'desc';
}

export interface NewsPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private apiService: ApiService) { }

  // Get all news articles
  getNews(filters?: NewsFilters): Observable<{ articles: NewsArticle[]; pagination: NewsPagination }> {
    return this.apiService.get<NewsArticle[]>('/news', filters).pipe(
      map((response: ApiResponse<NewsArticle[]>) => ({
        articles: response.data || [],
        pagination: response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10
        }
      }))
    );
  }

  // Get featured news articles
  getFeaturedNews(): Observable<NewsArticle[]> {
    return this.apiService.get<NewsArticle[]>('/news/featured').pipe(
      map((response: ApiResponse<NewsArticle[]>) => response.data || [])
    );
  }

  // Get news article by slug
  getNewsArticle(slug: string): Observable<NewsArticle> {
    return this.apiService.get<NewsArticle>(`/news/${slug}`).pipe(
      map((response: ApiResponse<NewsArticle>) => response.data!)
    );
  }

  // Get news categories
  getNewsCategories(): Observable<NewsCategory[]> {
    return this.apiService.get<NewsCategory[]>('/news/categories/list').pipe(
      map((response: ApiResponse<NewsCategory[]>) => response.data || [])
    );
  }

  // Get news by category
  getNewsByCategory(category: string, filters?: { page?: number; limit?: number }): Observable<{ articles: NewsArticle[]; category: any; pagination: NewsPagination }> {
    return this.apiService.get<NewsArticle[]>(`/news/category/${category}`, filters).pipe(
      map((response: ApiResponse<NewsArticle[]>) => ({
        articles: response.data || [],
        category: response.category || { name: category, slug: category },
        pagination: response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10
        }
      }))
    );
  }

  // Like/unlike news article
  likeArticle(id: string): Observable<any> {
    return this.apiService.post<any>(`/news/${id}/like`, {}).pipe(
      map((response: ApiResponse<any>) => response.data!)
    );
  }

  // Add comment to news article
  addComment(id: string, content: string, authorName: string, authorEmail: string): Observable<NewsComment> {
    return this.apiService.post<NewsComment>(`/news/${id}/comments`, {
      content,
      authorName,
      authorEmail
    }).pipe(
      map((response: ApiResponse<NewsComment>) => response.data!)
    );
  }

  // Search news articles
  searchNews(query: string, filters?: NewsFilters): Observable<{ articles: NewsArticle[]; pagination: NewsPagination }> {
    const searchFilters = { ...filters, search: query };
    return this.getNews(searchFilters);
  }

  // Get news categories list
  getCategoriesList(): string[] {
    return [
      'Technology',
      'Programming',
      'Machine Learning',
      'Workplace',
      'Architecture',
      'Career',
      'Industry',
      'Innovation'
    ];
  }

  // Get news tags
  getNewsTags(): string[] {
    return [
      'AI',
      'Education',
      'Technology',
      'Innovation',
      'Programming',
      'Career',
      'Development',
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'DevOps',
      'Testing',
      'UI/UX Design',
      'Database',
      'Cloud Computing',
      'Cybersecurity',
      'Remote Work',
      'Workplace',
      'Microservices',
      'Architecture',
      'Scalability'
    ];
  }

  // Get sort options
  getSortOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'publishedAt', label: 'Date Published' },
      { value: 'views', label: 'Most Viewed' },
      { value: 'likes', label: 'Most Liked' },
      { value: 'comments', label: 'Most Commented' }
    ];
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

  // Format relative time
  formatRelativeTime(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return this.formatDate(dateString);
    }
  }

  // Format number with commas
  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  // Truncate text
  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Generate slug from title
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}

