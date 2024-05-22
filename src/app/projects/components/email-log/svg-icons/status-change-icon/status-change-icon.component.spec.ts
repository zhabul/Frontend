import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusChangeIconComponent } from './status-change-icon.component';

describe('StatusChangeIconComponent', () => {
  let component: StatusChangeIconComponent;
  let fixture: ComponentFixture<StatusChangeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusChangeIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusChangeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
