import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSvgComponent } from './question-svg.component';

describe('QuestionSvgComponent', () => {
  let component: QuestionSvgComponent;
  let fixture: ComponentFixture<QuestionSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
