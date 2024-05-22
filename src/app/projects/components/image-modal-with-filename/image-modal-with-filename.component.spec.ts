import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageModalWithFilenameComponent } from './image-modal-with-filename.component';

describe('ImageModalWithFilenameComponent', () => {
  let component: ImageModalWithFilenameComponent;
  let fixture: ComponentFixture<ImageModalWithFilenameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageModalWithFilenameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageModalWithFilenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
