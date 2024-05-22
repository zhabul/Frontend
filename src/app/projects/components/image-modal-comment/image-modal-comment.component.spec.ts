import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageModalCommentComponent } from './image-modal-comment.component';

describe('ImageModalCommentComponent', () => {
  let component: ImageModalCommentComponent;
  let fixture: ComponentFixture<ImageModalCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageModalCommentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageModalCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
