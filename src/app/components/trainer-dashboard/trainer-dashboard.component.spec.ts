import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainerDashboardComponent } from './trainer-dashboard.component';

describe('TrainerDashboardComponent', () => {
  let component: TrainerDashboardComponent;
  let fixture: ComponentFixture<TrainerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainerDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerDashboardComponent);
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
    component.setActiveSection('courses');
    expect(component.activeSection).toBe('courses');
  });

  it('should toggle sidebar when toggleSidebar is called', () => {
    const initialState = component.sidebarCollapsed;
    component.toggleSidebar();
    expect(component.sidebarCollapsed).toBe(!initialState);
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('confirmed')).toBe('status-confirmed');
    expect(component.getStatusClass('pending')).toBe('status-pending');
    expect(component.getStatusClass('cancelled')).toBe('status-cancelled');
  });

  it('should return correct section title', () => {
    expect(component.getSectionTitle()).toBe('Dashboard Overview');
    component.setActiveSection('courses');
    expect(component.getSectionTitle()).toBe('My Courses');
  });

  it('should return correct section subtitle', () => {
    expect(component.getSectionSubtitle()).toContain('Welcome back');
    component.setActiveSection('courses');
    expect(component.getSectionSubtitle()).toContain('Manage your courses');
  });
});

