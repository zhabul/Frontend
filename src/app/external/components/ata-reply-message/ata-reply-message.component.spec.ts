import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AtaReplyMessageComponent } from "./ata-reply-message.component";

describe("AtaReplyMessageComponent", () => {
  let component: AtaReplyMessageComponent;
  let fixture: ComponentFixture<AtaReplyMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtaReplyMessageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtaReplyMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
