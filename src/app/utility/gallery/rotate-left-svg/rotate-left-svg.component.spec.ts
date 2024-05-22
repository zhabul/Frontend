import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotateLeftSvgComponent } from './rotate-left-svg.component';

describe('RotateLeftSvgComponent', () => {
  let component: RotateLeftSvgComponent;
  let fixture: ComponentFixture<RotateLeftSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RotateLeftSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RotateLeftSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
