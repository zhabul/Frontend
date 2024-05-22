import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserDayAbsencesComponent } from "./user-day-absences.component";

describe("UserDayAbsencesComponent", () => {
  let component: UserDayAbsencesComponent;
  let fixture: ComponentFixture<UserDayAbsencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserDayAbsencesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDayAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
