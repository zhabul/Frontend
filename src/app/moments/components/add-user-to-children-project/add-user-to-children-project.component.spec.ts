import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddUserToChildrenProjectComponent } from "./add-user-to-children-project.component";

describe("AddUserToChildrenProjectComponent", () => {
  let component: AddUserToChildrenProjectComponent;
  let fixture: ComponentFixture<AddUserToChildrenProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserToChildrenProjectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserToChildrenProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
