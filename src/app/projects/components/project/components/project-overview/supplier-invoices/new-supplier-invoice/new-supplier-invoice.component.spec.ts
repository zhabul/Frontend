import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSupplierInvoiceComponent } from './new-supplier-invoice.component';

describe('NewSupplierInvoiceComponent', () => {
  let component: NewSupplierInvoiceComponent;
  let fixture: ComponentFixture<NewSupplierInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSupplierInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSupplierInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
