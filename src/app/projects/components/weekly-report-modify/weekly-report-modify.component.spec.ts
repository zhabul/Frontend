import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReportModifyComponent } from './weekly-report-modify.component';

describe('WeeklyReportModifyComponent', () => {
  let component: WeeklyReportModifyComponent;
  let fixture: ComponentFixture<WeeklyReportModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyReportModifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyReportModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
