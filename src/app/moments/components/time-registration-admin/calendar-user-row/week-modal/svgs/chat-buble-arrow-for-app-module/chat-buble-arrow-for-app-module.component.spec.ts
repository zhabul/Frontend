import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChatBubleArrowForAppModuleComponent } from "./chat-buble-arrow-for-app-module.component";

describe("ChatBubleArrowForAppModuleComponent", () => {
  let component: ChatBubleArrowForAppModuleComponent;
  let fixture: ComponentFixture<ChatBubleArrowForAppModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatBubleArrowForAppModuleComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBubleArrowForAppModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
