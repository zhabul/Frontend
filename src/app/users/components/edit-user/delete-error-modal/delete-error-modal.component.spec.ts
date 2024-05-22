import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DeleteErrorModalComponent } from "./delete-error-modal.component";

describe("DeleteErrorModalComponent", () => {
  let component: DeleteErrorModalComponent;
  let fixture: ComponentFixture<DeleteErrorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteErrorModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
