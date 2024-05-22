import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChatBubbleArrowComponent } from "./chat-bubble-arrow.component";

describe("ChatBubbleArrowComponent", () => {
  let component: ChatBubbleArrowComponent;
  let fixture: ComponentFixture<ChatBubbleArrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatBubbleArrowComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBubbleArrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
