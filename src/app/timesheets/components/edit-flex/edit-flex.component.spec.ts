import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditFlexComponent } from "./edit-flex.component";

describe("EditFlexComponent", () => {
  let component: EditFlexComponent;
  let fixture: ComponentFixture<EditFlexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditFlexComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFlexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
