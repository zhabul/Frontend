import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpsHexSvgComponent } from './sps-hex-svg.component';

describe('SpsHexSvgComponent', () => {
  let component: SpsHexSvgComponent;
  let fixture: ComponentFixture<SpsHexSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpsHexSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpsHexSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
