import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentNotExistSvgComponent } from './comment-not-exist-svg.component';

describe('CommentNotExistSvgComponent', () => {
  let component: CommentNotExistSvgComponent;
  let fixture: ComponentFixture<CommentNotExistSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentNotExistSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentNotExistSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
