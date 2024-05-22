import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDropdownInvoiceComponent } from './select-dropdown-invoice.component';

describe('SelectDropdownInvoiceComponent', () => {
  let component: SelectDropdownInvoiceComponent;
  let fixture: ComponentFixture<SelectDropdownInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectDropdownInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectDropdownInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
