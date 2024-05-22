import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SetupBasicDataComponent } from "./setup-basic-data.component";

describe("SetupBasicDataComponent", () => {
  let component: SetupBasicDataComponent;
  let fixture: ComponentFixture<SetupBasicDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SetupBasicDataComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupBasicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
