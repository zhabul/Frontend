import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerToClientComponent } from './answer-to-client.component';

describe('AnswerToClientComponent', () => {
  let component: AnswerToClientComponent;
  let fixture: ComponentFixture<AnswerToClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerToClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerToClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
