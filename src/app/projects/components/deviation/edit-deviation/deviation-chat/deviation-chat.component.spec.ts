import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviationChatComponent } from './deviation-chat.component';

describe('DeviationChatComponent', () => {
  let component: DeviationChatComponent;
  let fixture: ComponentFixture<DeviationChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviationChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviationChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
