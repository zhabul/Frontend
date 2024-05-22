import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceTypeComponent } from './absence-type.component';

describe('AbsenceTypeComponent', () => {
  let component: AbsenceTypeComponent;
  let fixture: ComponentFixture<AbsenceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsenceTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
