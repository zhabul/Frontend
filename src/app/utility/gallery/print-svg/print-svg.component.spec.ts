import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSvgComponent } from './print-svg.component';

describe('PrintSvgComponent', () => {
  let component: PrintSvgComponent;
  let fixture: ComponentFixture<PrintSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
