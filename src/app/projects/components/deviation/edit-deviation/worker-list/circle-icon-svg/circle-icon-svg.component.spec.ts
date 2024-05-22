import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleIconSvgComponent } from './circle-icon-svg.component';

describe('CircleIconSvgComponent', () => {
  let component: CircleIconSvgComponent;
  let fixture: ComponentFixture<CircleIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircleIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircleIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
