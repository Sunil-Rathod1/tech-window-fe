import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MentorDashboardComponent } from './mentor-dashboard.component';

describe('MentorDashboardComponent', () => {
  let component: MentorDashboardComponent;
  let fixture: ComponentFixture<MentorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with overview section active', () => {
    expect(component.activeSection).toBe('overview');
  });

  it('should set active section when setActiveSection is called', () => {
    component.setActiveSection('mentees');
    expect(component.activeSection).toBe('mentees');
  });

  it('should toggle sidebar when toggleSidebar is called', () => {
    const initialState = component.sidebarCollapsed;
    component.toggleSidebar();
    expect(component.sidebarCollapsed).toBe(!initialState);
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('confirmed')).toBe('status-confirmed');
    expect(component.getStatusClass('pending')).toBe('status-pending');
    expect(component.getStatusClass('on-track')).toBe('status-on-track');
    expect(component.getStatusClass('needs-attention')).toBe('status-needs-attention');
    expect(component.getStatusClass('excellent')).toBe('status-excellent');
  });

  it('should return correct section title', () => {
    expect(component.getSectionTitle()).toBe('Mentor Dashboard');
    component.setActiveSection('mentees');
    expect(component.getSectionTitle()).toBe('My Mentees');
  });

  it('should return correct section subtitle', () => {
    expect(component.getSectionSubtitle()).toContain('Welcome back');
    component.setActiveSection('mentees');
    expect(component.getSectionSubtitle()).toContain('Track and manage');
  });

  it('should return correct progress class', () => {
    expect(component.getProgressClass(85)).toBe('progress-excellent');
    expect(component.getProgressClass(65)).toBe('progress-good');
    expect(component.getProgressClass(45)).toBe('progress-fair');
    expect(component.getProgressClass(25)).toBe('progress-needs-work');
  });
});


