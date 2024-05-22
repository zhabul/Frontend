import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollEmailLogsComponent } from './payroll-email-logs.component';

describe('PayrollEmailLogsComponent', () => {
  let component: PayrollEmailLogsComponent;
  let fixture: ComponentFixture<PayrollEmailLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollEmailLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollEmailLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
