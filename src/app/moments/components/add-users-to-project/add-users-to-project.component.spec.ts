import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddUsersToProjectComponent } from "./add-users-to-project.component";

describe("AddUsersToProjectComponent", () => {
  let component: AddUsersToProjectComponent;
  let fixture: ComponentFixture<AddUsersToProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddUsersToProjectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUsersToProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
