import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

export interface PageBreadcrumbItem {
  label: string;
  link?: string | any[];
  isExternal?: boolean;
}

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css'],
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() showBack = true;
  @Input() backLabel = 'Back';
  @Input() backLink?: string | any[];
  @Input() breadcrumbItems: PageBreadcrumbItem[] = [];
  @Output() back = new EventEmitter<void>();

  constructor(private location: Location, private router: Router) {}

  onBackClick(): void {
    this.back.emit();

    if (this.back.observers.length > 0) {
      return;
    }

    if (this.backLink) {
      if (Array.isArray(this.backLink)) {
        this.router.navigate(this.backLink);
      } else {
        this.router.navigate([this.backLink]);
      }
      return;
    }

    this.location.back();
  }

  isExternalLink(item: PageBreadcrumbItem): boolean {
    return typeof item.link === 'string';
  }

  toExternalUrl(link?: string | any[]): string {
    return typeof link === 'string' ? link : '';
  }
}

