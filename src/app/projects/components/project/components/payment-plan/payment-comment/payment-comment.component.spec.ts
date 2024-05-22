import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PaymentCommentComponent } from "./payment-comment.component";

describe("PaymentCommentComponent", () => {
  let component: PaymentCommentComponent;
  let fixture: ComponentFixture<PaymentCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentCommentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
