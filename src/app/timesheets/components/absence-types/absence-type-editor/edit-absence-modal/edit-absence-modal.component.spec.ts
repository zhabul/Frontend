import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAbsenceModalComponent } from './edit-absence-modal.component';

describe('EditAbsenceModalComponent', () => {
  let component: EditAbsenceModalComponent;
  let fixture: ComponentFixture<EditAbsenceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAbsenceModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAbsenceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
