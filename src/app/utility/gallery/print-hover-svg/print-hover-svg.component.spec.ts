import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintHoverSvgComponent } from './print-hover-svg.component';

describe('PrintHoverSvgComponent', () => {
  let component: PrintHoverSvgComponent;
  let fixture: ComponentFixture<PrintHoverSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintHoverSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintHoverSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
