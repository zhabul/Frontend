import { TestBed } from '@angular/core/testing';

import { WeeklyReportInfoService } from './weekly-report-info.service';

describe('WeeklyReportInfoService', () => {
  let service: WeeklyReportInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklyReportInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
