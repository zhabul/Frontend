import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDotsSvg2Component } from './three-dots-svg2.component';

describe('ThreeDotsSvg2Component', () => {
  let component: ThreeDotsSvg2Component;
  let fixture: ComponentFixture<ThreeDotsSvg2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeDotsSvg2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreeDotsSvg2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
