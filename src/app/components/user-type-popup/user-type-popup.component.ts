import { Component, EventEmitter, Output, Input } from '@angular/core';

export type UserType = 'student' | 'trainer' | 'mentor' | 'institution';

@Component({
  selector: 'app-user-type-popup',
  templateUrl: './user-type-popup.component.html',
  styleUrls: ['./user-type-popup.component.css']
})
export class UserTypePopupComponent {
  @Input() mode: 'signin' | 'signup' = 'signup';
  @Output() close = new EventEmitter<void>();
  @Output() userTypeSelected = new EventEmitter<UserType>();

  // User type data
  userTypes = [
    {
      type: 'student' as UserType,
      title: 'Student',
      icon: 'fas fa-graduation-cap',
      color: '#4CAF50',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
    },
    {
      type: 'trainer' as UserType,
      title: 'Trainer',
      icon: 'fas fa-chalkboard-teacher',
      color: '#FF9800',
      gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
    },
    {
      type: 'mentor' as UserType,
      title: 'Mentor',
      icon: 'fas fa-user-graduate',
      color: '#2196F3',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)'
    },
    {
      type: 'institution' as UserType,
      title: 'Institution',
      icon: 'fas fa-building',
      color: '#9C27B0',
      gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)'
    }
  ];

  getTitle(): string {
    return this.mode === 'signin' ? 'Sign In' : 'Join TechWindows';
  }

  getSubtitle(): string {
    return this.mode === 'signin' ? 'Choose your account type' : 'Choose your account type to get started';
  }

  // Close popup
  closePopup(): void {
    this.close.emit();
  }

  // Handle backdrop click
  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closePopup();
    }
  }

  // Handle card click
  onCardClick(userType: UserType): void {
    this.userTypeSelected.emit(userType);
  }
}
