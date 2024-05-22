import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviationCommentComponent } from './deviation-comment.component';

describe('DeviationCommentComponent', () => {
  let component: DeviationCommentComponent;
  let fixture: ComponentFixture<DeviationCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviationCommentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviationCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
