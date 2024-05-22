import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowDownSvg2Component } from './arrow-down-svg2.component';

describe('ArrowDownSvg2Component', () => {
  let component: ArrowDownSvg2Component;
  let fixture: ComponentFixture<ArrowDownSvg2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowDownSvg2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowDownSvg2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
