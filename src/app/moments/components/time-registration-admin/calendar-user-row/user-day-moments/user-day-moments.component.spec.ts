import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserDayMomentsComponent } from "./user-day-moments.component";

describe("UserDayMomentsComponent", () => {
  let component: UserDayMomentsComponent;
  let fixture: ComponentFixture<UserDayMomentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserDayMomentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDayMomentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
