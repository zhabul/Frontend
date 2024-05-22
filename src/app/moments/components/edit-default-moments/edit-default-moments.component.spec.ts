import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditDefaultMomentsComponent } from "./edit-default-moments.component";

describe("EditDefaultMomentsComponent", () => {
  let component: EditDefaultMomentsComponent;
  let fixture: ComponentFixture<EditDefaultMomentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditDefaultMomentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDefaultMomentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
