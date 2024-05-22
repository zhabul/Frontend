import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyCalendarRowComponent } from './empty-calendar-row.component';

describe('EmptyCalendarRowComponent', () => {
  let component: EmptyCalendarRowComponent;
  let fixture: ComponentFixture<EmptyCalendarRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyCalendarRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyCalendarRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
