import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingContactClientComponent } from './adding-contact-client.component';

describe('AddingContactClientComponent', () => {
  let component: AddingContactClientComponent;
  let fixture: ComponentFixture<AddingContactClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddingContactClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddingContactClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
