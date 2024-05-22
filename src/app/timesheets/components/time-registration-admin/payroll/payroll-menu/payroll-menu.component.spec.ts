import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollMenuComponent } from './payroll-menu.component';

describe('PayrollMenuComponent', () => {
  let component: PayrollMenuComponent;
  let fixture: ComponentFixture<PayrollMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
