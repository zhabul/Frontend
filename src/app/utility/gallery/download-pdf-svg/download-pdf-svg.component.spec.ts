import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPdfSvgComponent } from './download-pdf-svg.component';

describe('DownloadPdfSvgComponent', () => {
  let component: DownloadPdfSvgComponent;
  let fixture: ComponentFixture<DownloadPdfSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadPdfSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadPdfSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
