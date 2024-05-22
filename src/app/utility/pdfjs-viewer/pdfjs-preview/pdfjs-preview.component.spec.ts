import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfjsPreviewComponent } from './pdfjs-preview.component';

describe('PdfjsPreviewComponent', () => {
  let component: PdfjsPreviewComponent;
  let fixture: ComponentFixture<PdfjsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfjsPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfjsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
