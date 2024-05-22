import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientResponsesComponent } from './client-responses.component';

describe('ClientResponsesComponent', () => {
  let component: ClientResponsesComponent;
  let fixture: ComponentFixture<ClientResponsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientResponsesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
