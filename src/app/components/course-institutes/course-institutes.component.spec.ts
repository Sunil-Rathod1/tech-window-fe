import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseInstitutesComponent } from './course-institutes.component';

describe('CourseInstitutesComponent', () => {
  let component: CourseInstitutesComponent;
  let fixture: ComponentFixture<CourseInstitutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseInstitutesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseInstitutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
