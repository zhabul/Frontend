import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ModalPlaceholderComponent } from "./modal-placeholder.component";

describe("ModalPlaceholderComponent", () => {
  let component: ModalPlaceholderComponent;
  let fixture: ComponentFixture<ModalPlaceholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPlaceholderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
