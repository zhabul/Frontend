import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckedCircleIconSvgComponent } from './checked-circle-icon-svg.component';

describe('CheckedCircleIconSvgComponent', () => {
  let component: CheckedCircleIconSvgComponent;
  let fixture: ComponentFixture<CheckedCircleIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckedCircleIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckedCircleIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
