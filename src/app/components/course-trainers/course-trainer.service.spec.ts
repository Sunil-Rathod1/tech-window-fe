import { TestBed } from '@angular/core/testing';

import { CourseTrainerService } from './course-trainer.service';

describe('CourseTrainerService', () => {
  let service: CourseTrainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseTrainerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
