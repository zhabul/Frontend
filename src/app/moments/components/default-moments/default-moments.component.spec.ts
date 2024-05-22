import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DefaultMomentsComponent } from "./default-moments.component";

describe("DefaultMomentsComponent", () => {
  let component: DefaultMomentsComponent;
  let fixture: ComponentFixture<DefaultMomentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultMomentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultMomentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
