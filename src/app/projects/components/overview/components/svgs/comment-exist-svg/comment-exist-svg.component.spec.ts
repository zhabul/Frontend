import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentExistSvgComponent } from './comment-exist-svg.component';

describe('CommentExistSvgComponent', () => {
  let component: CommentExistSvgComponent;
  let fixture: ComponentFixture<CommentExistSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentExistSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentExistSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
