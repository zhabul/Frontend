import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NewDefaultMomentsComponent } from "./new-default-moments.component";

describe("NewDefaultMomentsComponent", () => {
  let component: NewDefaultMomentsComponent;
  let fixture: ComponentFixture<NewDefaultMomentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewDefaultMomentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDefaultMomentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
