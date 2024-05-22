import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceNameComponent } from './absence-name.component';

describe('AbsenceNameComponent', () => {
  let component: AbsenceNameComponent;
  let fixture: ComponentFixture<AbsenceNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsenceNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenceNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
