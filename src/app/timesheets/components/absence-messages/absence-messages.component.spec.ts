import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AbsenceMessagesComponent } from "./absence-messages.component";

describe("AbsenceMessagesComponent", () => {
  let component: AbsenceMessagesComponent;
  let fixture: ComponentFixture<AbsenceMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AbsenceMessagesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenceMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
