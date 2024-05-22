import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AllSupplierInvoicesComponent } from "./all-supplier-invoices.component";

describe("AllSupplierInvoicesComponent", () => {
  let component: AllSupplierInvoicesComponent;
  let fixture: ComponentFixture<AllSupplierInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllSupplierInvoicesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSupplierInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
