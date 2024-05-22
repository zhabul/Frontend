import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NotificationTasksComponent } from "./notification-tasks.component";

describe("NotificationTasksComponent", () => {
  let component: NotificationTasksComponent;
  let fixture: ComponentFixture<NotificationTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationTasksComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
