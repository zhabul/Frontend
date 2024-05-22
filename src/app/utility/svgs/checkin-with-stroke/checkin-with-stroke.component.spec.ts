import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinWithStrokeComponent } from './checkin-with-stroke.component';

describe('CheckinWithStrokeComponent', () => {
  let component: CheckinWithStrokeComponent;
  let fixture: ComponentFixture<CheckinWithStrokeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckinWithStrokeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckinWithStrokeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
