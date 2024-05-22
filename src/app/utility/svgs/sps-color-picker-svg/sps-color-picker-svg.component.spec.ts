import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpsColorPickerSvgComponent } from './sps-color-picker-svg.component';

describe('ColorPickerSvgComponent', () => {
  let component: SpsColorPickerSvgComponent;
  let fixture: ComponentFixture<SpsColorPickerSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpsColorPickerSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpsColorPickerSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
