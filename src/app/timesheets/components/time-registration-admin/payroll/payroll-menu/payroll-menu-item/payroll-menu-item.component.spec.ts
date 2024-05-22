import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollMenuItemComponent } from './payroll-menu-item.component';

describe('PayrollMenuItemComponent', () => {
  let component: PayrollMenuItemComponent;
  let fixture: ComponentFixture<PayrollMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollMenuItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
