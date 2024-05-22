import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNameModalComponent } from './add-name-modal.component';

describe('AddNameModalComponent', () => {
  let component: AddNameModalComponent;
  let fixture: ComponentFixture<AddNameModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNameModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
