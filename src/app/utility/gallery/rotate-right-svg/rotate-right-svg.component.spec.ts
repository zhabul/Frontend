import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotateRightSvgComponent } from './rotate-right-svg.component';

describe('RotateRightSvgComponent', () => {
  let component: RotateRightSvgComponent;
  let fixture: ComponentFixture<RotateRightSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RotateRightSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RotateRightSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
