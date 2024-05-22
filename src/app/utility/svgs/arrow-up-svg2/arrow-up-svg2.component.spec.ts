import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowUpSvg2Component } from './arrow-up-svg2.component';

describe('ArrowUpSvg2Component', () => {
  let component: ArrowUpSvg2Component;
  let fixture: ComponentFixture<ArrowUpSvg2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowUpSvg2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowUpSvg2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
