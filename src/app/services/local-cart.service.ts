import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LocalCartItem {
  id: string;
  title: string;
  description: string;
  institute: string;
  mentor: string;
  mode: string;
  duration: string;
  level: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  tags: string[];
  addedAt: string;
  quantity?: number;
  routeLink?: string;
  courseId?: string;  // Course ID from backend
  trainerId?: string; // Trainer ID from backend
  instructorId?: string; // Alias for trainerId
}

const CART_STORAGE_KEY = 'techwindows_learning_cart';

@Injectable({
  providedIn: 'root',
})
export class LocalCartService {
  private itemsSubject = new BehaviorSubject<LocalCartItem[]>(this.loadItemsFromStorage());
  public readonly items$ = this.itemsSubject.asObservable();

  get items(): LocalCartItem[] {
    return this.itemsSubject.value;
  }

  addItem(item: LocalCartItem): void {
    const items = [...this.items];
    const existingIndex = items.findIndex((existing) => existing.id === item.id);

    if (existingIndex > -1) {
      const existing = items[existingIndex];
      const quantity = existing.quantity ?? 1;
      items[existingIndex] = {
        ...existing,
        quantity: quantity + 1,
        addedAt: new Date().toISOString(),
      };
    } else {
      items.unshift({
        ...item,
        quantity: item.quantity ?? 1,
        addedAt: item.addedAt ?? new Date().toISOString(),
      });
    }

    this.persist(items);
  }

  removeItem(id: string): void {
    const items = this.items.filter((item) => item.id !== id);
    this.persist(items);
  }

  clear(): void {
    this.persist([]);
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }

  private persist(items: LocalCartItem[]): void {
    this.itemsSubject.next(items);
    if (this.isBrowser()) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }

  private loadItemsFromStorage(): LocalCartItem[] {
    if (!this.isBrowser()) {
      return [];
    }

    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Unable to parse cart storage', error);
      return [];
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }
}


