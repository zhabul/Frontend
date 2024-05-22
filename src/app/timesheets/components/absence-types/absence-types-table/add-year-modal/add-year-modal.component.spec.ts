import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddYearModalComponent } from './add-year-modal.component';

describe('AddYearModalComponent', () => {
  let component: AddYearModalComponent;
  let fixture: ComponentFixture<AddYearModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddYearModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddYearModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
