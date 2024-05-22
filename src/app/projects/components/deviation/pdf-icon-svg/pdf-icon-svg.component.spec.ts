import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfIconSvgComponent } from './pdf-icon-svg.component';

describe('PdfIconSvgComponent', () => {
  let component: PdfIconSvgComponent;
  let fixture: ComponentFixture<PdfIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
