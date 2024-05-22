import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PaymentPlanPdfComponent } from "./payment-plan-pdf.component";

describe("PaymentPlanPdfComponent", () => {
  let component: PaymentPlanPdfComponent;
  let fixture: ComponentFixture<PaymentPlanPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentPlanPdfComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPlanPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
