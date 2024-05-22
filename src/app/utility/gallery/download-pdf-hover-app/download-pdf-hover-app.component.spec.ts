import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPdfHoverAppComponent } from './download-pdf-hover-app.component';

describe('DownloadPdfHoverAppComponent', () => {
  let component: DownloadPdfHoverAppComponent;
  let fixture: ComponentFixture<DownloadPdfHoverAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadPdfHoverAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadPdfHoverAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
