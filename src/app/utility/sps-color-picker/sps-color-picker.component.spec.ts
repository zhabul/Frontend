import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpsColorPickerComponent } from './sps-color-picker.component';

describe('ColorPickerComponent', () => {
  let component: SpsColorPickerComponent;
  let fixture: ComponentFixture<SpsColorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpsColorPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpsColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
