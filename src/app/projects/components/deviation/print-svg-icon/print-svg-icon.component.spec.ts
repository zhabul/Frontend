import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSvgIconComponent } from './print-svg-icon.component';

describe('PringSvgIconComponent', () => {
  let component: PrintSvgIconComponent;
  let fixture: ComponentFixture<PrintSvgIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSvgIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintSvgIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
