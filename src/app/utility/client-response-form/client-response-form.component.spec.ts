import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientResponseFormComponent } from './client-response-form.component';

describe('ClientResponseFormComponent', () => {
  let component: ClientResponseFormComponent;
  let fixture: ComponentFixture<ClientResponseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientResponseFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientResponseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
