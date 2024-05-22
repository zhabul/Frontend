import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowSvgComponent } from './arrow-svg.component';

describe('ArrowSvgComponent', () => {
  let component: ArrowSvgComponent;
  let fixture: ComponentFixture<ArrowSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
