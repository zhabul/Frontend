import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditSupplierInvoiceComponent } from "./edit-supplier-invoice.component";

describe("EditSupplierInvoiceComponent", () => {
  let component: EditSupplierInvoiceComponent;
  let fixture: ComponentFixture<EditSupplierInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditSupplierInvoiceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSupplierInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
