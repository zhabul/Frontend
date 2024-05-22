import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PaymentPlanEmailComponent } from "./payment-plan-email.component";

describe("PaymentPlanEmailComponent", () => {
  let component: PaymentPlanEmailComponent;
  let fixture: ComponentFixture<PaymentPlanEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentPlanEmailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPlanEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
