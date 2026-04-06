import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InistitutionCoursesComponent } from './inistitution-courses.component';

describe('InistitutionCoursesComponent', () => {
  let component: InistitutionCoursesComponent;
  let fixture: ComponentFixture<InistitutionCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InistitutionCoursesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InistitutionCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
