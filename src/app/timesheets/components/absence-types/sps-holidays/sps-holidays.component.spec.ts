import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpsHolidaysComponent } from './sps-holidays.component';

describe('SpsHolidaysComponent', () => {
  let component: SpsHolidaysComponent;
  let fixture: ComponentFixture<SpsHolidaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpsHolidaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpsHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
