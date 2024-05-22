import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarIconSvgComponent } from './calendar-icon-svg.component';

describe('CalendarIconSvgComponent', () => {
  let component: CalendarIconSvgComponent;
  let fixture: ComponentFixture<CalendarIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
