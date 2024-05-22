import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NotificationTaskModalComponent } from "./notification-task-modal.component";

describe("NotificationTaskModalComponent", () => {
  let component: NotificationTaskModalComponent;
  let fixture: ComponentFixture<NotificationTaskModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationTaskModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
