import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ClientAttachmentsComponent } from "./client-attachments.component";

describe("ClientAttachmentsComponent", () => {
  let component: ClientAttachmentsComponent;
  let fixture: ComponentFixture<ClientAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientAttachmentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
