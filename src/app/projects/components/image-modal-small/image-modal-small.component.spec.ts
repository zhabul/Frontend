import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageModalSmallComponent } from './image-modal-small.component';

describe('ImageModalSmallComponent', () => {
  let component: ImageModalSmallComponent;
  let fixture: ComponentFixture<ImageModalSmallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageModalSmallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageModalSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
