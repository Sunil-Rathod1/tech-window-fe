import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstitutionDashboardComponent } from './institution-dashboard.component';

describe('InstitutionDashboardComponent', () => {
  let component: InstitutionDashboardComponent;
  let fixture: ComponentFixture<InstitutionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionDashboardComponent);
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
    expect(component.getStatusClass('active')).toBe('status-active');
    expect(component.getStatusClass('completed')).toBe('status-completed');
    expect(component.getStatusClass('on-leave')).toBe('status-on-leave');
  });

  it('should return correct section title', () => {
    expect(component.getSectionTitle()).toBe('Institution Dashboard');
    component.setActiveSection('courses');
    expect(component.getSectionTitle()).toBe('Course Management');
  });

  it('should return correct section subtitle', () => {
    expect(component.getSectionSubtitle()).toContain('Welcome back');
    component.setActiveSection('courses');
    expect(component.getSectionSubtitle()).toContain('Manage your courses');
  });

  it('should return correct trend icon and class', () => {
    expect(component.getTrendIcon('up')).toBe('fas fa-arrow-up');
    expect(component.getTrendIcon('down')).toBe('fas fa-arrow-down');
    expect(component.getTrendClass('up')).toBe('trend-up');
    expect(component.getTrendClass('down')).toBe('trend-down');
  });
});


