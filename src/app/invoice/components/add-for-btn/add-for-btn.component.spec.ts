import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddForBtnComponent } from './add-for-btn.component';

describe('AddForBtnComponent', () => {
  let component: AddForBtnComponent;
  let fixture: ComponentFixture<AddForBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddForBtnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddForBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
