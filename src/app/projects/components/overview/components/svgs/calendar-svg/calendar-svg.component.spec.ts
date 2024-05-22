import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSvgComponent } from './calendar-svg.component';

describe('CalendarSvgComponent', () => {
  let component: CalendarSvgComponent;
  let fixture: ComponentFixture<CalendarSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
