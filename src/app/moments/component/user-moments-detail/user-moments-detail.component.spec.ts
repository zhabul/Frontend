import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserMomentsDetailComponent } from "./user-moments-detail.component";

describe("UserMomentsDetailComponent", () => {
  let component: UserMomentsDetailComponent;
  let fixture: ComponentFixture<UserMomentsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserMomentsDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMomentsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
