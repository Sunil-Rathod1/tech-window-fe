import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCoursesComponent } from './account-courses.component';

describe('AccountCoursesComponent', () => {
  let component: AccountCoursesComponent;
  let fixture: ComponentFixture<AccountCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountCoursesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
