import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierInvoicesPreviewComponent } from './supplier-invoices-preview.component';

describe('SupplierInvoicesPreviewComponent', () => {
  let component: SupplierInvoicesPreviewComponent;
  let fixture: ComponentFixture<SupplierInvoicesPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierInvoicesPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierInvoicesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
