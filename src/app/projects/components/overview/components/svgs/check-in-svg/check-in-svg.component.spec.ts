import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInSvgComponent } from './check-in-svg.component';

describe('CheckInSvgComponent', () => {
  let component: CheckInSvgComponent;
  let fixture: ComponentFixture<CheckInSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckInSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
