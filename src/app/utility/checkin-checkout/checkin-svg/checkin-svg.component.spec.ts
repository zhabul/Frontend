import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinSvgComponent } from './checkin-svg.component';

describe('CheckinSvgComponent', () => {
  let component: CheckinSvgComponent;
  let fixture: ComponentFixture<CheckinSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckinSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckinSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
