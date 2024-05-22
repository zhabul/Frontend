import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierInvoiceModalComponent } from './supplier-invoice-modal.component';

describe('SupplierInvoiceModalComponent', () => {
  let component: SupplierInvoiceModalComponent;
  let fixture: ComponentFixture<SupplierInvoiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierInvoiceModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierInvoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
