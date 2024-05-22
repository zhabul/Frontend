import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyToQuestionComponent } from './reply-to-question.component';

describe('ReplyToQuestionComponent', () => {
  let component: ReplyToQuestionComponent;
  let fixture: ComponentFixture<ReplyToQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplyToQuestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplyToQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
