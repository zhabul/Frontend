import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowRightSvgComponent } from './arrow-right-svg.component';

describe('ArrowRightSvgComponent', () => {
  let component: ArrowRightSvgComponent;
  let fixture: ComponentFixture<ArrowRightSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowRightSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowRightSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
