import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SupportTasksComponent } from "./support-tasks.component";

describe("SupportTasksComponent", () => {
  let component: SupportTasksComponent;
  let fixture: ComponentFixture<SupportTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupportTasksComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
