import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPdfPreviewComponent } from './main-pdf-preview.component';

describe('MainPdfPreviewComponent', () => {
  let component: MainPdfPreviewComponent;
  let fixture: ComponentFixture<MainPdfPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainPdfPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPdfPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
