import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DeviationReplyMessageComponent } from "./deviation-reply-message.component";

describe("DeviationReplyMessageComponent", () => {
  let component: DeviationReplyMessageComponent;
  let fixture: ComponentFixture<DeviationReplyMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeviationReplyMessageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviationReplyMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
