import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollUserListComponent } from './payroll-user-list.component';

describe('PayrollUserListComponent', () => {
  let component: PayrollUserListComponent;
  let fixture: ComponentFixture<PayrollUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollUserListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
